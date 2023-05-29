const {
  getContentMarkdown,
  capitalizeFirstLetter,
  getAndroidIosWebMarkdown,
  getBoilerplatesMarkdown,
} = require("./helper");
const header = `
<p align="center">
<img src="./icons/icon.png" width="150">
</p>

# Awesome React Native open source applications

List of awesome open source mobile applications in React Nativve. This list contains a lot of React Native, and cross-platform apps. The main goal of this repository is to find free open source apps and start contributing. Feel free to [contribute](CONTRIBUTING.md) to the list, any suggestions are welcome!

### Would you like to support me?

<div align="center">
<a href="https://github.com/numandev1?tab=followers">
    <img src="https://img.shields.io/github/followers/numandev1?label=Follow%20%40numandev1&style=social" height="36" />
</a>
<a href="https://www.youtube.com/@numandev?sub_confirmation=1"><img src="https://img.shields.io/youtube/channel/subscribers/UCYCUspfN7ZevgCj3W5GlFAw?style=social" height="36" /><a/>
</br>
<a href="https://www.buymeacoffee.com/numan.dev" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
</div>

`;

let footer = `

## Contributors

Thanks to all the people who contribute:

<a href="https://github.com/numandev1/open-source-react-native-apps/graphs/contributors"><img src="https://opencollective.com/open-source-react-native-apps/contributors.svg?width=890&button=false" /></a>
`;

class JSONApplications {
  constructor(applications) {
    this.applications = applications;
  }

  static fromJSON(json) {
    const { applications } = json;
    return new JSONApplications(applications);
  }
}

class JSONApplication {
  constructor(
    title,
    icon_url,
    repo_url,
    short_description,
    languages,
    screenshots,
    categories,
    android,
    ios,
    web,
    version
  ) {
    this.title = title;
    this.icon_url = icon_url;
    this.repo_url = repo_url;
    this.short_description = short_description;
    this.languages = languages;
    this.screenshots = screenshots;
    this.categories = categories;
    this.android = android;
    this.ios = ios;
    this.web = web;
    this.version = version;
  }

  static fromJSON(json) {
    const {
      title,
      icon_url,
      repo_url,
      short_description,
      languages,
      screenshots,
      categories,
      android,
      ios,
      web,
      version,
    } = json;
    return new JSONApplication(
      title,
      icon_url,
      repo_url,
      short_description,
      languages,
      screenshots,
      categories,
      android,
      ios,
      web,
      version
    );
  }

  markdownDescription() {
    let markdown_description = "";

    markdown_description += `- [${this.title}](${this.repo_url}) - ${
      this.short_description
    } <br/> **Languages**: ${this.languages
      .map((lang) => capitalizeFirstLetter(lang))
      .join(",")}<br/>**Version**:`;
    markdown_description += this.version ? this.version + "<br/>" : "";
    markdown_description += getAndroidIosWebMarkdown(
      this.android,
      this.ios,
      this.web
    );
    return markdown_description;
  }
}

class Categories {
  constructor(categories) {
    this.categories = categories;
  }

  static fromJSON(json) {
    const { categories } = json;
    return new Categories(categories);
  }
}

class Category {
  constructor(title, id, description, parent) {
    this.title = title;
    this.id = id;
    this.description = description;
    this.parent = parent;
  }

  static fromJSON(json) {
    const { title, id, description, parent } = json;
    return new Category(title, id, description, parent);
  }
}

class ReadmeGenerator {
  constructor() {
    this.readmeString = "";
  }

  generateReadme() {
    console.log("Start");
    try {
      const fs = require("fs");
      const path = require("path");

      // Get current file path
      const thisFilePath = __filename;
      let url = path.resolve(thisFilePath);

      // cd ../ to the root folder (delete `.github/main.swift`)
      url = path.dirname(path.dirname(url));

      const applicationsUrl = path.join(url, FilePaths.applications);
      const applicationsData = fs.readFileSync(applicationsUrl);
      const categoriesData = fs.readFileSync(
        path.join(url, FilePaths.categories)
      );
      const jsonDecoder = JSON;
      const applicationsObject = JSONApplications.fromJSON(
        jsonDecoder.parse(applicationsData)
      );
      const categoriesObject = Categories.fromJSON(
        jsonDecoder.parse(categoriesData)
      );

      let categories = categoriesObject.categories;
      const subcategories = categories.filter(
        (category) => category.parent !== null && category.parent !== undefined
      );
      const applications = applicationsObject.applications;

      for (const subcategory of subcategories) {
        const index = categories.findIndex(
          (category) => category.parent !== subcategory.id
        );
        if (index !== -1) {
          categories.splice(index, 1);
        }
      }

      categories.sort((a, b) => a.title.localeCompare(b.title));

      this.readmeString += header;
      const contentMarkdown = getContentMarkdown(categoriesObject.categories);
      this.readmeString += contentMarkdown;
      console.log("Start iteration....");

      for (const category of categories) {
        this.readmeString += `${String.enter}${String.section}${String.space}${category.title}${String.enter}`;
        let categoryApplications = applications.filter((application) =>
          application.categories.includes(category.id)
        );
        categoryApplications.sort((a, b) => a.title.localeCompare(b.title));

        for (const application of categoryApplications) {
          this.readmeString +=
            JSONApplication.fromJSON(application).markdownDescription();
          this.readmeString += String.enter;
        }

        let subcategories = categories.filter(
          (subcategory) => subcategory.parent === category.id
        );
        if (subcategories.length > 0) {
          subcategories.sort((a, b) => a.title.localeCompare(b.title));
          for (const subcategory of subcategories) {
            this.readmeString += `${String.enter}${String.subsection}${String.space}${subcategory.title}${String.enter}`;
            let categoryApplications = applications.filter((application) =>
              application.categories.includes(subcategory.id)
            );
            categoryApplications.sort((a, b) => a.title.localeCompare(b.title));

            for (const application of categoryApplications) {
              this.readmeString += application.markdownDescription();
              this.readmeString += String.enter;
            }
          }
        }
      }
      console.log("Finish iteration...");
      this.readmeString += getBoilerplatesMarkdown();
      this.readmeString += footer;
      fs.writeFileSync(path.join(url, FilePaths.readme), this.readmeString);
      console.log("Finish");
    } catch (error) {
      console.log(error);
    }
  }
}

const String = {
  empty: "",
  space: " ",
  enter: "\n",
  section: "###",
  subsection: "####",
  iconPrefix: "_icon",
};

const FilePaths = {
  readme: "./README.md",
  applications: "./applications.json",
  categories: "./categories.json",
};

const Constants = {
  detailsBeginString:
    '<details> <summary> Screenshots </summary> <p float="left">',
  detailsEndString: "</p></details>",
  srcLinePattern: "<bt><img src='%@' width=\"400\"/>",
  startProcessString: "### Database",
  endProcessString: "### Development",
  regex: function (type) {
    return `\\((.+\.${type})`;
  },
  regex1: function (type) {
    return `\"(.+\.${type})`;
  },
};

new ReadmeGenerator().generateReadme();

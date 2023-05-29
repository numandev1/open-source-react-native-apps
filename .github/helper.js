module.exports.getContentMarkdown = (categories) => {
  let contentMarkdown = "## Contents\n";
  categories
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((category) => {
      contentMarkdown += `- [${category.title}](#${category.id})\n`;
    });
  contentMarkdown += `

## Applications\n`;
  return contentMarkdown;
};

module.exports.capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.getAndroidIosWebMarkdown = (android, ios, web) => {
  return `${
    android ? "**📱Android**:[" + android + "](" + android + ")<br/>" : ""
  }
  ${ios ? "**IOS**:[" + ios + "](" + ios + ")<br/>" : ""}
  ${web ? "**🌐Web**:[" + web + "](" + web + ")<br/>" : ""}`;
};

module.exports.getBoilerplatesMarkdown = () => {
  const Boilerplates = require("../boilerplates.json");
  let contentMarkdown = "## Boilerplates\n";
  Boilerplates.forEach((item) => {
    contentMarkdown += `${item.Title} ${item.Description}<br/>**Version:**${item.RN_Version}<br/>**Last Commit:**${item.LastCommit}<br/>**Github Stars:**${item.GithubStars}<br/><br/>`;
  });
  return contentMarkdown;
};

var inquirer = require("inquirer");
var axios = require("axios");
var generateHtml = require("./generateHTML");
var fs = require("fs");
var pdf = require("html-pdf");
var data = {};
function askQuestions() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "what is your username?",
        name: "username"
      },
      {
        type: "list",
        message: "What is your favorite color?",
        name: "color",
        choices: ["green", "blue", "pink", "red"]
      }
    ])
    .then(function(input) {
      axios
        .get("https://api.github.com/users/" + input.username)
        .then(function(response) {
          data.color = input.color;
          data.avatar_url = response.data.avatar_url;
          data.name = response.data.name;
          data.public_repos = response.data.public_repos;
          data.followers = response.data.followers;
          data.following = response.data.following;
          data.bio = response.data.bio;
          data.company = response.data.company;
          data.location = response.data.location;
          axios
            .get("https://api.github.com/users/" + input.username + "/starred")
            .then(function(response2) {
              var count = 0;
              for (let index = 0; index < response2.data.length; index++) {
                count = count + response2.data[index].stargazers_count;
              }
              data.stargazers_count = count;
              console.log(data);
              var html = generateHtml(data);
              fs.writeFile("./index.html", html, function(error) {
                if (error) {
                  console.log(error);
                }
                var options = { format: "Letter" };

                pdf
                  .create(html, options)
                  .toFile("./profileGen.pdf", function(err, res) {
                    if (err) return console.log(err);
                    console.log(res); // { filename: '/app/businesscard.pdf' }
                  });
              });
            });
        });
    });
}
askQuestions();

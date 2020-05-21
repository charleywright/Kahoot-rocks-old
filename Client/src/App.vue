<template>
  <v-app>
    <v-container class="px-auto px-sm-12 v-container">
      <v-row class="mb-6" no-gutters>
        <v-col xl="8" lg="10" md="12" class="ma-auto">
          <h1
            class="display-3 font-weight-medium text-center"
            v-if="$vuetify.breakpoint.smAndUp"
            style="margin: 5vh 0 15vh;"
          >
            Kahoot.rocks
          </h1>
          <h1
            class="display-1 font-weight-medium text-center"
            v-if="!$vuetify.breakpoint.smAndUp"
            style="margin: 2vh 0 5vh;"
          >
            Kahoot.rocks
          </h1>
          <v-alert transition="fade-transition" type="warning">
            Currently, some Kahoot's with non-English characters in their names
            (Æ, Ë, Π, Σ, Ϗ etc) may not work properly. Fix coming soon.
          </v-alert>
          <v-alert v-if="someError" transition="fade-transition" type="error">
            {{ errorMessage }}
          </v-alert>
          <v-alert
            v-if="someSuccess"
            transition="fade-transition"
            type="success"
            >{{ successMessage }}</v-alert
          >
          <v-card class="mb-12">
            <v-form class="d-flex align-center pa-5 pt-12" v-model="input">
              <v-text-field
                v-model="pin"
                :rules="pinRules"
                class="mr-sm-5 mr-1"
                label="Game Pin"
                hide-details="auto"
              ></v-text-field>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                class="ml-sm-5 lm-1"
                label="Username"
                hide-details="auto"
              ></v-text-field>
            </v-form>
            <div class="text-center">
              <v-btn
                v-on:click="Kahoot()"
                class="ma-5"
                style="-webkit-animation: bgcolor 20s infinite;
                  animation: bgcolor 10s infinite;
                  -webkit-animation-direction: alternate;
                  animation-direction: alternate;"
                >Join Game</v-btn
              >
            </div>
          </v-card>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Advanced features</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-form v-model="advanced">
                  <v-text-field
                    v-model="delay"
                    :rules="delayRules"
                    label="Answer delay (ms)"
                    hide-details="auto"
                  ></v-text-field>
                  <v-text-field
                    v-model="endpoint"
                    :rules="endpointRules"
                    label="Custom API endpoint"
                    hide-details="auto"
                  ></v-text-field>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Instructions for use</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>
                  Kahoot.rocks is very simple to use, all you have to do is
                  enter the game pin, and the username you want to use. Then
                  click Join Game. There are also some more advanced features,
                  although they do not normally need to be used, as they are
                  entirely optional. Answer delay is how long the bot should
                  wait before it answers the current question, meaning you can
                  make the bot answer super fast, or slow it down as much as you
                  want. 100 is a good starting point as it isn't too suspicious
                  although going slower may be better. You can also specify an
                  API endpoint, although this is a setting mainly for
                  developers, and shouldn't be used unless you know what you are
                  doing. (It's where your POST request is sent).
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Help!! It's not working</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>
                  There are a few reasons Kahoot.rocks might not be working
                  properly, with the main one being that the Kahoot is private
                  although there are a few settings that can be activated to
                  stop bots from working. These are
                  <code>Randomize order of questions</code>,
                  <code>Randomize order of answers</code> and
                  <code>2 Step Join</code>. The bot could also not be working if
                  the servers have crashed (very unlikely) or that they are
                  updating (very rare). In general, if you want help, or the bot
                  isn't working, create a ticket in our
                  <a href="https://wag1memeing.com/discord">Discord Server</a>
                  (channel is #support). Our admins will respond as soon as they
                  can. A very useful piece of information to help us diagnose
                  the issue, is either the name of the Kahoot, or the URL to it
                  (the one that allows you to host a game)
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>How it works</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  Kahoot.rocks works by acting as a client, and using the
                  information it is sent to search for Kahoot's. As the quiz
                  goes on, the bot will narrow down the possible candidates
                  until there is only one. Because of the way this works, most
                  of the time before the first question has even started, the
                  bot already knows the correct answers. If the bot for some
                  reason does not know or cannot find the answers, (normally on
                  a private Kahoot because the answers aren't publicly
                  available), it will answer randomly.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Why it exists</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  Kahoot.rocks was initially created as a fun way for a
                  developer at
                  <a href="https://wag1memeing.com">Wag1 Memeing</a> to learn
                  JavaScript and Node.js, while making a fun tool at the same
                  time to mess around with at school, although it soon expanded
                  into a full-on project. The code went through many revisions,
                  to increase speed and accurcay, along with the UI changing
                  multiple times. Now the project is being worked on constantly,
                  trying to find new ways to solve problems, faster ways to get
                  answers, and inprove accuracy to 100%.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Who made it</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  Kahoot.rocks was made by and is maintained by Charley Wright,
                  a web developer from Scotland. He enjoys making projects that
                  other people can benefit from, and also a challenge, such as
                  learning a new technology or programming language. He mainly
                  focusses on web development, although has dabbled in game dev
                  and desktop apps. His current focus is server-side
                  architechture and programming, and building API's.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Why should it be used</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>
                  Kahoot.rocks normally would be used when you either do not
                  know the answers to the questions, or if you simply cannot be
                  bothered answering although they can also be used if there is
                  a prize for getting first or something similar. (Using a bot
                  is unethical, and could result in you gtting in trouble. That
                  is entirely your fault, and we take no responsibility with how
                  you use the bot). You can also use Kahoot.rocks for whatever
                  reason you like, it's not set in stone or anything, and there
                  aren't any rules.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Kahoot.rocks is banned at my
                school/workplace</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>
                  Do not worry, we have you covered. Try one of our backup
                  links:<br /><a href="https://kahoot.wag1memeing.com"
                    >kahoot.wag1memeing.com</a
                  ><br /><a href="https://kahoot.charleyw.com"
                    >kahoot.charleyw.com</a
                  ><br /><a href="https://kahoot.quizlet.rocks"
                    >kahoot.quizlet.rocks</a
                  >
                  <br />If you have a domain and want to host a backup link,
                  please open a ticket in our
                  <a href="https://wag1memeing.com/discord">Discord Server</a>.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Some other stuff</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>
                  Because Kahoot.rocks is entirely free to use, it could
                  potentially get shutdown at any time from any number of
                  reasons. If you want, you can help out by
                  <a href="https://paypal.me/charleyw0">donating</a> to help pay
                  for the server costs. Kahoot.rocks is also a project, not a
                  full enterprise level app, so there is no update schedule,
                  fixes happen when they happen, so do updates.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div class="text-center mt-10" v-if="$vuetify.breakpoint.smAndUp">
            <v-btn
              v-for="btn in buttons"
              :key="btn.msg"
              :href="btn.link"
              large
              class="ma-2"
              outlined
              color="indigo"
            >
              <iconify-icon
                class="mr-2"
                :data-icon="btn.icon"
                style="color: #3f51b5;"
                height="20px"
                width="20px"
              ></iconify-icon>
              {{ btn.msg }}
            </v-btn>
          </div>
          <div class="text-center mt-10" v-if="!$vuetify.breakpoint.smAndUp">
            <v-btn
              v-for="btn in buttons"
              :key="btn.msg"
              :href="btn.link"
              class="ma-2"
              outlined
              color="indigo"
            >
              <iconify-icon
                class="mr-2"
                :data-icon="btn.icon"
                style="color: #3f51b5;"
                height="20px"
                width="20px"
              ></iconify-icon>
              {{ btn.msg }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-footer app class="d-flex flex-column text-center">
      <div style="font-size: 12px; text-align: center;">
        <span ma-auto>&copy; 2020 Kahoot Rocks</span>
        <span class="px-1">|</span>
        <a href="/terms.html">Terms & Conditions</a>
        <span class="px-1">|</span>
        <a href="/privacy.html">Privacy Policy</a>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Home",
  props: {
    source: String
  },
  data: () => ({
    pin: "",
    username: "",
    input: false,
    delay: "",
    endpoint: "",
    advanced: false,
    someError: false,
    errorMessage: "",
    someSuccess: false,
    successMessage: "",
    buttons: [
      {
        link: "https://wag1memeing.com",
        icon: "whh:website",
        msg: "Website"
      },
      {
        link: "https://wag1memeing.com/discord",
        icon: "fa-brands:discord",
        msg: "Discord"
      },
      {
        link: "https://paypal.me/charleyw0",
        icon: "bx:bx-dollar",
        msg: "Donate"
      }
    ],
    usernameRules: [
      value => !!value || "Required.",
      value => {
        let regex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        return regex.test(value) || "Cannot contain special characters";
      }
    ],
    pinRules: [
      value => !!value || "Required.",
      value => {
        let regex = /^[0-9]*$/gm;
        return regex.test(value) || "Has to be a number";
      }
    ],
    delayRules: [
      value => {
        let regex = /^[0-9]*$/gm;
        return regex.test(value) || value == "" ? true : "Not a number";
      }
    ],
    endpointRules: [
      value => {
        let regex = new RegExp(
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+:[0-9]+(?:\.))/gi
        );
        return value.match(regex) || value == "" ? true : "Inavlid URL";
      }
    ]
  }),
  methods: {
    Error(msg) {
      this.errorMessage = msg;
      this.someError = true;
      setTimeout(() => {
        this.someError = false;
      }, 3000);
      return false;
    },
    Success(msg) {
      this.successMessage = msg;
      this.someSuccess = true;
      setTimeout(() => {
        this.someSuccess = false;
      }, 3000);
    },
    async Kahoot() {
      if (this.pin == "" || this.username == "") {
        return this.Error("Game pin or username can't be empty");
      }

      if (isNaN(this.pin)) return this.Error("Game pin has to be a number");
      if (isNaN(this.delay)) return this.Error("Delay has to be a number");

      if (!this.input) return this.Error("Pin and Username criteria not met");
      if (!this.advanced && this.endpoint != "")
        return this.Error("URL criteria not met");

      const RequestURL =
        this.endpoint == "" ? "https://kahoot.rocks/api" : this.endpoint;

      const data = {
        pin: Number(this.pin),
        username: this.username,
        delay: this.delay == "" ? 100 : Number(this.delay)
      };

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      };

      let res = await fetch(RequestURL, options);

      switch (await res.text()) {
        case "All good":
          this.Success("Joined game succsfully");
          break;
        case "Incorrect pin":
          this.Error(
            "Either the game pin is invalid, or that username is taken"
          );
          break;
        case "Information incorrect":
          this.Error("Information in incorrect format");
          break;
        case "Pin or Delay is not a number":
          this.Error("Pin or Delay is not a number");
          break;
      }
    }
  },
  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>

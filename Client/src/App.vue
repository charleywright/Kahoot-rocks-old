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
                  Laborum nulla velit exercitation dolore do sint ea velit ea.
                  Veniam commodo tempor nisi elit occaecat exercitation
                  excepteur fugiat ut fugiat est sunt consequat voluptate. Sunt
                  eu exercitation consequat do consectetur. Est laboris in ea
                  voluptate non ad proident pariatur esse aliqua labore sint
                  qui. Consequat officia minim ipsum consequat incididunt nulla
                  incididunt id mollit laboris ullamco nulla irure consequat.
                  Nostrud pariatur ullamco Lorem enim deserunt. Non eu officia
                  do pariatur aliquip non consequat enim exercitation cillum
                  mollit voluptate.
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>How it works</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  Laborum nulla velit exercitation dolore do sint ea velit ea.
                  Veniam commodo tempor nisi elit occaecat exercitation
                  excepteur fugiat ut fugiat est sunt consequat voluptate. Sunt
                  eu exercitation consequat do consectetur. Est laboris in ea
                  voluptate non ad proident pariatur esse aliqua labore sint
                  qui. Consequat officia minim ipsum consequat incididunt nulla
                  incididunt id mollit laboris ullamco nulla irure consequat.
                  Nostrud pariatur ullamco Lorem enim deserunt. Non eu officia
                  do pariatur aliquip non consequat enim exercitation cillum
                  mollit voluptate.
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
      <div style="font-size: 13px; text-align: center;" v-if="!$vuetify.breakpoint.smAndUp">
        <span ma-auto>&copy; 2020 Wag1 Memeing</span>
        <span class="px-1">|</span>
        <a href="/terms.html">Terms & Conditions</a>
        <span class="px-1">|</span>
        <a href="/privacy.html">Privacy Policy</a>
      </div>
      <div style="text-align: center;" v-if="$vuetify.breakpoint.smAndUp">
        <span ma-auto>&copy; 2020 Wag1 Memeing</span>
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
        this.endpoint == ""
          ? "https://api.kahoot.rocks/api"
          : this.endpoint;

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
          this.Success("Request successful");
          break;
        case "Incorrect pin":
          this.Success("Invalid game PIN");
          break;
        case "Information incorrect":
          this.Success("Information in incorrect format");
          break;
        case "Pin or Delay is not a number":
          this.Success("Pin or Delay is not a number");
          break;
      }
    }
  },
  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>

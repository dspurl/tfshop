import { VueBus } from "./index";

declare module "vue/types/vue" {
  interface Vue {
    $bus: VueBus;
  }

  interface VueConstructor {
    bus: VueBus;
  }
}

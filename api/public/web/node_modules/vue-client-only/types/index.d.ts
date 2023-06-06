import { FunctionalComponentOptions } from 'vue';

export interface ClientOnlyProps {
  placeholder?: string;
  placeholderTag?: string;
}

declare const ClientOnly: FunctionalComponentOptions<ClientOnlyProps>;

export default ClientOnly;

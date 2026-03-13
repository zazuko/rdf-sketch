import type { RdfPrefix } from "@/components/RdfEditor.vue";


class SketchPrefixMap {
    #prefixes: Record<string, string> = {};

    update(prefixList: RdfPrefix[]) {
        this.#prefixes = {};
        prefixList.forEach(prefix => {
            this.#prefixes[prefix.prefix] = prefix.uri;
        });
    }

    get prefixes() {
        return this.#prefixes;
    }
}

export const prefixMap = new SketchPrefixMap();
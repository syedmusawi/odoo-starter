/** @odoo-module **/

import { useRef, onMounted } from "@odoo/owl";

export function useAutoFocus(input) {
    const myRef = useRef(input);
    onMounted(() => {
      myRef.el.focus();
    });
}

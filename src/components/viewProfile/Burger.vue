<template>
    <div id="burger"
         :class="{ 'active' : isBurgerActive }"
         @click.prevent="toggle">
         <slot>
            <a class="btn-floating waves-effect waves-light deep-purple" title="Logout"><i class="material-icons">account_circle</i>Profil</a>
         </slot>
    </div>
</template>

<script>
import { store, mutations } from '@/store.js'
    
export default {
    computed: {
        isBurgerActive() {
            return store.isNavOpen
        }
    },
    methods: {
        toggle() {
            mutations.toggleNav()
        }
    }
}
</script>

<style>
   

    button {
        cursor: pointer;
    }

    /* remove blue outline */
    button:focus {
        background-color: transparent;
    }

    .burger-button {
        position: relative;
        height: 30px;
        width: 32px;
        display: block;
        z-index: 999;
        border: 0;
        border-radius: 0;
        background-color: transparent;
        pointer-events: all;
    }


</style>
<template>
    <div id="app">
        <img src="./assets/logo.png">
        <div style="display: flex; justify-content: space-around">
            <Verify @success="alert('success')" @error="alert('error')" :type="1"></Verify>
            <Verify @success="alert('success')" @error="alert('error')" :type="2"></Verify>
            <Verify @success="alert('success')" @error="alert('error')" :type="3"></Verify>
        </div>
        <div style="display: flex; justify-content: space-around; margin-top: 120px;">
            <Verify @success="alert('success')" @error="alert('error')" :type="4"></Verify>
            <Verify @success="alert('success')" @error="alert('error')" :type="5"></Verify>
        </div>
    </div>
</template>

<script>
    import Verify from './components/Verify'

    export default {
        name: 'app',
        methods: {
            alert(text) {
                console.log(text)
            }
        },
        components: {
            Verify
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>

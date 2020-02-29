<template>
    <div>
        <top-bar></top-bar>
        <router-view></router-view>
    </div>
</template>
<script>
    import TopBar from './layout/TopBar';
    export default {
        components: {
            TopBar
        }
    }
</script>
<style lang="less" scoped>

</style>

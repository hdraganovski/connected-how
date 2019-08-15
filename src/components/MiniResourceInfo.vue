<template>
    <v-card class="wrap">
        <h3>{{ resource ? resource.label : ''}}</h3>
    </v-card>    
</template>

<script>
export default {
    props: ['resource']
}
</script>

<style lang="scss" scoped>
    .wrap {
        padding: 5px 20px;
    }
</style>
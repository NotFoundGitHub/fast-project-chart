<template>
  <div class="hello">
	<img :src="backUrl" alt="back" v-if="!!backUrl">
	<Button type="primary" @click="getFastProjectInfo">show</Button>
    <Card :bordered="false">
      <p slot="title">No border title</p>
      <p>{{msg}}</p>
    </Card>
  </div>
</template>

<script>
import cache from '../cache/cache';
export default {
    name: 'HelloWorld',
    data () {
        return {
			msg: 'Welcome to Your Vue.js App',
			backUrl: ''
        };
    },
    methods: {
        async getFastProjectInfo () {
			let data = await cache.getProjectInfo({projectId: 6})
			this.msg = data;
			this.backUrl = data.smallFaceUrl;
			console.log(data)
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

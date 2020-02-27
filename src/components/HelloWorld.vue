<template>
  <div class="hello">
	<Button type="primary" @click="getFastProjectInfo">show</Button>
    <Card :bordered="false">
      <p slot="title">No border title</p>
      <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type.</p>
    </Card>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'HelloWorld',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        };
    },
    methods: {
        getFastProjectInfo () {
            axios.get('/api/v1/live/fast/ide/project/get.json?projectId=6').then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
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

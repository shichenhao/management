<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    export default {
        components:{
            vHead
        },
        methods: {
            getCommon() {
                //查询商家列表
                this.$axios.post('/express/manageClient/findExpressMerchantDTOList',addToken()).then((res)=>{
                    window.list.merchantName=res.data.value
                })
                //查询下拉代理商列表
                this.$axios.post('/express/manageClient/findAgentDTOList',addToken()).then((res)=>{
                    window.list.agentName=res.data.value
                })
                //查询省市区列表
                this.$axios.post('/express/public/findRegionDataDTOList').then((res)=>{
                    //sessionStorage.setItem('merchantId',1222)
                    window.list.province=res.data.value
                })

            }
        },
        mounted(){
            this.getCommon()
            if(this.$route.query.token){
                sessionStorage.setItem("token",this.$route.query.token)
            }
        }
    }
</script>

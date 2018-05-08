<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item>
                <el-select v-if="loginType" v-model="searchParam.agentId" placeholder="所属代理商" @change="getMerchantName()">
                    <el-option v-for="item in list.agentName" :key="item.agentId" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchParam.merchantId" placeholder="所属商家">
                    <el-option v-for="item in list.merchantName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchParam.orderId" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchParam.consignerMobile" placeholder="发货人手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchParam.status" placeholder="订单状态">
                    <el-option v-for="item in list.orderStatus" :key="item.val" :label="item.name" :value="item.val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchParam.paymentState" placeholder="付款状态">
                    <el-option v-for="item in list.hasBinding" :key="item.val" :label="item.name" :value="item.val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="searchParam.data"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions2">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-form style="padding: 0 0 20px">
            <el-button type="primary" :disabled="!multipleSelection.length" icon="el-icon-news" @click="clearOrder()">取件</el-button>
        </el-form>
        <el-table
            v-loading="searchLoading"
            :data="tableData && tableData.list || []"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55"
                align="center"
                :selectable="selectable"
            >
            </el-table-column>
            <el-table-column
                label="订单号"
                prop="id"
                width="160"
                align="center">
            </el-table-column>
            <el-table-column
                label="代理商"
                prop="agentName"
                min-width="120">
            </el-table-column>
            <el-table-column
                label="所属商家"
                prop="expressMerchantName"
                width="120">
            </el-table-column>
            <el-table-column
                label="发货人"
                prop="consignerName"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="发货地址"
                prop="consignerAddress"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="收货人"
                prop="consigneeName"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="收货地址"
                prop="consigneeAddress"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="取件时间"
                prop="modifyTime"
                width="110"
                align="center">
            </el-table-column>
            <el-table-column
                label="订单状态"
                width="100"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersOrders(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                width="120"
                prop="remark">
            </el-table-column>
            <el-table-column
                label="快递公司"
                prop="expressMerchantName"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                label="基础费用"
                prop="price"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="系统收益"
                prop="sysRateAmt"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="省级代理商收益"
                prop="provinceAgentRateAmt"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="合伙人收益"
                prop="partnerAgentRateAmt"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="板块服务商"
                prop="merchantAmt"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="付款类型"
                prop="sysRateAmt"
                width="100"
                align="center">
                <template slot-scope="scope">
                    在线支付
                </template>
            </el-table-column>
            <el-table-column
                label="付款状态"
                width="100"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersOrders(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间"
                prop="modifyTime"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="createTime"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="100"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status === 0 || scope.row.status === 1" @click="cancelOrder(scope.row.id)" size="small">取消订单</el-button>
                    <el-button type="text" v-if="scope.row.status === -1" @click="lookOrder(scope.row.cancelReason)" size="small">查看取消原因</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableData && tableData.total">
            <el-pagination
                @current-change="onSearch"
                layout="prev, pager, next"
                :page-size="20"
                :total="tableData.total || 0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginType:sessionStorage.getItem('loginType')==1 ? true : false,//登录权限 0 代理商 1 管理员
                dialogFormVisible: false,//新增修改弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                list,
                searchParam: {},
                addParam:{},
                multipleSelection: [],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        methods: {
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                if(this.searchParam.data){
                    this.searchParam.startTime=this.searchParam.data[0]
                    this.searchParam.endTime=this.searchParam.data[1]
                    delete this.searchParam.data
                }
                this.$axios.post('/express/manageClient/findExpressOrderList',addToken(this.searchParam)).then((res)=>{
                    this.searchLoading=false
                    //console.log(res.data.value)
                    this.tableData=res.data.value
                })
            },
            handleSelectionChange(val) {//选中的数据
                this.multipleSelection = val;
            },
            clearOrder(id) {//取件
                let ids = this.multipleSelection.map(item=> item.id).toString();
                this.dialogFormVisible=true
                this.$axios.post('/express/manageClient/batchDoneExpressOrder',addToken({ids})).then((res)=>{
                  if(res.data.success){
                    this.onSearch()
                  }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })
            },
            cancelOrder(id) {//取消订单
                console.log(id)
                this.dialogFormVisible=true
                this.$axios.post('/express/manageClient/cancelExpressOrder',addToken({id})).then((res)=>{
                  if(res.data.success){
                    this.onSearch()
                  }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })
            },
            lookOrder(txt){ // 查看取消原因
                this.$alert(txt , '取消原因', {
                    confirmButtonText: '确定'
                });
            },
            selectable(row){
                if(row.status === 2){
                    return true
                }else{
                    return false
                }

            }
        },
        created(){
            this.onSearch()
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>

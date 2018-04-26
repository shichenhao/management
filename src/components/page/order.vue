<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="searchParam.agentId" placeholder="所属代理商">
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
                    <el-option v-for="item in list.status" :key="item.val" :label="item.name" :value="item.val"></el-option>
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
        <el-form>
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
            >
            </el-table-column>
            <el-table-column
                label="订单号"
                prop="orderId"
                width="120">
            </el-table-column>
            <el-table-column
                label="代理商"
                prop="agentName"
                width="120">
            </el-table-column>
            <el-table-column
                label="所属商家"
                prop="expressMerchantName"
                width="120">
            </el-table-column>
            <el-table-column
                label="发货人"
                prop="name"
                width="120">
            </el-table-column>
            <el-table-column
                label="发货地址"
                prop="consignerProvinceName"
                width="120">
            </el-table-column>
            <el-table-column
                label="收货人"
                prop="name"
                width="120">
            </el-table-column>
            <el-table-column
                label="收货地址"
                prop="consigneeProvinceName"
                width="120">
            </el-table-column>
            <el-table-column
                label="取件时间"
                prop="modifyTime"
                width="120">
            </el-table-column>
            <el-table-column
                label="订单状态"
                prop="name"
                width="120">
                <template slot-scope="scope">
                    {{"状态".filtersSatus(scope.row.state)}}
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                prop="name">
            </el-table-column>
            <el-table-column
                label="快递公司"
                prop="name"
                width="120">
            </el-table-column>
            <el-table-column
                label="费用预估"
                prop="name"
                width="120">
            </el-table-column>
            <el-table-column
                label="付款金额"
                prop="name"
                width="120">
            </el-table-column>
            <el-table-column
                label="系统收益"
                prop="name"
                width="120">
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
                this.searchParam.start=start || 1
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
                this.dialogFormVisible=true
                this.$axios.post('/express/manageClient/batchDoneExpressOrder',addToken(this.multipleSelection)).then((res)=>{
                  if(res.data.success){
                    this.onSearch()
                  }
                })
            }
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

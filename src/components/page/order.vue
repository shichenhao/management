<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline" ref="searchParam">
            <el-form-item prop="agentId">
                <el-select v-if="loginType" v-model="searchParam.agentId" placeholder="所属代理商" @change="getMerchantName()">
                    <el-option v-for="item in list.agentName" :key="item.agentId" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="merchantId">
                <el-select v-model="searchParam.merchantId" placeholder="所属商家">
                    <el-option v-for="item in list.merchantName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="orderId">
                <el-input v-model="searchParam.orderId" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item prop="consignerMobile">
                <el-input v-model="searchParam.consignerMobile" placeholder="发货人手机号"></el-input>
            </el-form-item>
            <el-form-item prop="status">
                <el-select v-model="searchParam.status" placeholder="订单状态">
                    <el-option v-for="item in list.orderStatus" :key="item.val" :label="item.name" :value="item.val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="paymentState">
                <el-select v-model="searchParam.paymentState" placeholder="付款状态">
                    <el-option v-for="item in list.hasBinding" :key="item.val" :label="item.name" :value="item.val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="data">
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
                <el-button type="primary" icon="el-icon-menu" @click="calAll()">统计</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm('searchParam')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-form style="padding: 0 0 20px">
            <el-button type="primary" :disabled="!multipleSelection.length" icon="el-icon-news" @click="clearOrder('/express/manageClient/batchDoneExpressOrder')">取件</el-button>
        </el-form>
        <el-table
            v-loading="searchLoading"
            :data="tableData && tableData.list || []"
            border
            tooltip-effect="dark"
            style="width: 100%"
            height="500"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55"
                align="center"
                :selectable="selectable"
            >
            </el-table-column>
            <el-table-column
                label="编号"
                width="60"
                align="center"
                type="index"
                :index="indexMethod">
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
                prop="expressMerchant.name"
                width="120">
            </el-table-column>
            <el-table-column
                label="发货人"
                prop="consignerName"
                width="120"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.consignerName + ' | ' + scope.row.consignerMobile}}
                </template>
            </el-table-column>
            <el-table-column
                label="发货地址"
                prop="consignerAddress"
                width="120"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.consignerAddress + ' | ' + scope.row.consignerHouseNumber}}
                </template>
            </el-table-column>
            <el-table-column
                label="收货人"
                prop="consigneeName"
                width="100"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.consigneeName + ' | ' + scope.row.consigneeMobile}}
                </template>
            </el-table-column>
            <el-table-column
                label="收货地址"
                prop="consigneeAddress"
                width="120"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.consigneeAddress + ' | ' + scope.row.consigneeHouseNumber}}
                </template>
            </el-table-column>
            <el-table-column
                label="取件时间"
                prop="modifyTime"
                width="110"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.pickUpDate + ' ' + scope.row.pickUpTime}}
                </template>
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
                prop="expressMerchant.name"
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
                label="商家收益"
                prop="merchantAmt"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                label="板块服务商"
                prop="agentRateAmt"
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
                    <div>
                        <el-button type="text" v-if="scope.row.status !== -1 && scope.row.status !== 4" @click="cancelOrder(scope.row.id)" size="small">取消订单</el-button>
                    </div>
                    <div>
                        <el-button type="text" v-if="scope.row.status === -1" @click="lookOrder(scope.row.cancelReason)" size="small">查看取消原因</el-button>
                    </div>
                    <div>
                        <el-button type="text" v-if="scope.row.status === 2" @click="clearOrder('/express/manageClient/confirmExpressOrder',scope.row.id)" size="small">确认订单</el-button>
                    </div>
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



        <el-dialog title="取消订单" :visible.sync="dialogFormVisible" v-loading="addLoading">
            <el-form :model="addParam" :rules="rules" ref="addParam">
                <el-form-item label="取消原因" prop="cancelReason" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入取消原因"
                        v-model="addParam.cancelReason">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addInit()">取 消</el-button>
                <el-button type="primary" @click="handleAdd('addParam')">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="统计" :visible.sync="callType" v-loading="addLoading" width="800px">

            <el-table
                :data="tableDataPop || []"
                border
                style="width: 100%">
                <el-table-column
                    label="订单数量"
                    prop="total"
                    width="160"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="系统收益"
                    prop="sysRateAmtSum"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="省级代理商收益"
                    prop="provinceAgentRateAmtSum"
                    width="199"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="合伙人收益"
                    prop="partnerAgentRateAmtSum"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="板块服务商"
                    prop="agentRateAmtSum"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="商家收益"
                    prop="merchantAmtSum"
                    width="100"
                    align="center">
                </el-table-column>
            </el-table>
        </el-dialog>




    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginType:sessionStorage.getItem('loginType')==1 ? true : false,//登录权限 0 代理商 1 管理员
                dialogFormVisible: false,//新增修改弹窗
                callType: false,//统计弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                tableDataPop: null,
                list,
                searchParam: {
                    merchantId:''
                },
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
                rules: {
                    cancelReason: [
                        { required: true, message: '请填写取消原因', trigger: 'change' }
                    ],
                },
                formLabelWidth: '100px'
            }
        },
        methods: {
            getMerchantName(){ // 获取商户名称
                this.$axios.post('/express/manageClient/findExpressMerchantDTOList',addToken({agentId:this.searchParam.agentId || this.addParam.agentId})).then((res)=>{
                    window.list.merchantName=res.data.value
                    this.searchParam.merchantId = this.searchParam.merchantId && null
                })
            },
            indexMethod(index) {//序号
                return index + 1;
            },
            addInit(type){ // 创建成功后初始化数据
                this.dialogFormVisible=type || false;
                this.addParam={}
            },
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                if(!this.searchParam.agentId){
                    delete  this.searchParam.agentId;
                }
                if(!this.searchParam.orderId){
                    delete  this.searchParam.orderId;
                }
                if(!this.searchParam.consignerMobile){
                    delete  this.searchParam.consignerMobile;
                }
                if(!this.searchParam.status){
                    delete  this.searchParam.status;
                }
                if(!this.searchParam.paymentState){
                    delete  this.searchParam.paymentState;
                }
                if(!this.searchParam.data){
                    delete  this.searchParam.data;
                }
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
            clearOrder(url, id) {//取件
                let ids = id || this.multipleSelection.map(item=> item.id).toString();
                this.$axios.post(url, addToken(id ? { id } : { ids })).then((res)=>{
                  if(res.data.success){
                    this.$message.success('操作成功！');
                    this.onSearch(this.searchParam.start/20+1);
                  }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })
            },
            calAll() {//统计
                if(!this.searchParam.agentId){
                    delete  this.searchParam.agentId;
                }
                if(this.searchParam.data){
                    this.searchParam.startTime=this.searchParam.data[0]
                    this.searchParam.endTime=this.searchParam.data[1]
                    delete this.searchParam.data
                }
                this.$axios.post('/express/manageClient/findExpressOrderAgentAmt',addToken(this.searchParam)).then((res)=>{
                    let arr =[]
                    arr.push(res.data.value)
                    this.callType=true
                    //console.log(res.data.value)
                    this.tableDataPop=arr
                })
            },
            resetForm(formName) { //重置
                this.$refs[formName].resetFields();
            },
            cancelOrder(id) {//取消订单弹窗
                this.dialogFormVisible = true;
                this.addParam.id = id;
                if(this.$refs['addParam']!==undefined){
                    this.$refs['addParam'].resetFields();
                }
                //cancelReason
                /*this.$axios.post('/express/manageClient/cancelExpressOrder',addToken({id})).then((res)=>{
                  if(res.data.success){
                    this.onSearch()
                  }
                }).catch((error)=>{
                    this.$message.error(error.response.data.message);
                })*/
            },
            handleAdd(formName) {//取消订单
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        this.$axios.post('/express/manageClient/cancelExpressOrder',addToken(this.addParam)).then((res)=>{
                          if(res.data.success){
                              this.$message.success("取消成功");
                              this.dialogFormVisible = false;
                              this.addLoading = false;
                          }
                        }).catch((error)=>{
                            this.$message.error(error.response.data.message);
                            this.addLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            lookOrder(txt){ // 查看取消原因
                this.$alert(txt , '取消原因', {
                    confirmButtonText: '确定'
                });
            },
            selectable(row){
                if(row.status === 3){
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

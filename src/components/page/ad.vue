<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline" ref="searchParam">
            <el-form-item prop="agentId">
                <el-select v-if="loginType" v-model="searchParam.agentId" placeholder="代理商名称">
                    <el-option v-for="item in list.agentName" :key="item.agentId" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm('searchParam')">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
                <el-button type="primary" icon="el-icon-plus" @click="handleEdit()">新建</el-button>
            </el-form-item>
        </el-form>
        <el-table
            v-loading="searchLoading"
            :data="tableData && tableData.list || []"
            border
            style="width: 100%">
            <el-table-column
                label="编号"
                width="60"
                align="center"
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column
                prop="agentName"
                label="所属代理商">
            </el-table-column>
            <el-table-column
                prop="imgUrl"
                label="图片"
                min-width="120"
                align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.imgUrl" alt="">
                </template>
            </el-table-column>
            <el-table-column
                prop="modifyTime"
                label="更新时间"
                min-width="200"
                align="center">
            </el-table-column>
            <el-table-column
                label="状态"
                width="100"
                align="center">
                <template slot-scope="scope">
                    {{"状态".filtersSatus(scope.row.state)}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="60"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row.id)" size="small">编辑</el-button>
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

        <el-dialog title="广告" :visible.sync="dialogFormVisible" v-loading="addLoading">
            <el-form :model="addParam" :rules="rules" ref="addParam">
                <el-form-item label="所属代理商" prop="agentId" :label-width="formLabelWidth" v-if="loginType">
                    <el-select v-model="addParam.agentId" placeholder="请选择">
                        <el-option v-for="item in list.agentNameAdd" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转地址" prop="gotoUrl" :label-width="formLabelWidth">
                    <label class="adFile">
                        上传图片
                        <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
                    </label>
                    <div class="bannerImg">
                        <img :src="addParam.imgUrl" width="100" v-if="addParam.imgUrl">
                    </div>
                </el-form-item>
                <el-form-item label="跳转地址" prop="gotoUrl" :label-width="formLabelWidth">
                    <el-input v-model="addParam.gotoUrl"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="addParam.state" placeholder="请选择" >
                        <el-option v-for="item in list.status" :key="item.val" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addInit()">取 消</el-button>
                <el-button type="primary" @click="handleAdd('addParam')">确 定</el-button>
            </div>
        </el-dialog>
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
                fileList:[],
                list,
                searchParam: {
                },
                addParam:{
                    state:1
                },
                rules: {
                    agentId: [
                        { required: true, message: '请选择代理商', trigger: 'change' }
                    ],
                },
                form:{

                },
                formLabelWidth: '100px'
            }
        },
        methods: {
            resetForm(formName) { //重置
                this.$refs[formName].resetFields();
            },
            addInit(type){ // 创建成功后初始化数据
                this.dialogFormVisible=type || false;
                this.addParam={
                    state:1
                };
            },
            indexMethod(index) {//序号
                return index + 1;
            },
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=((start-1)*20) || 0
                if(!this.searchParam.agentId){
                    delete  this.searchParam.agentId;
                }
                //console.log('搜索条件',this.searchParam);
                this.$axios.post("/express/manageClient/findExpressBannerListByPage",addToken(this.searchParam)).then((res)=>{
                    this.searchLoading=false;
                    //console.log(res.data);
                    this.tableData=res.data.value;
                })
            },
            handleAdd(formName) {//新增
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addLoading=true;
                        if(this.addParam.gotoUrl === null){
                            delete this.addParam.gotoUrl;
                        }
                        console.log(this.addParam);
                        this.$axios.post("/express/manageClient/createOrMergeExpressBanner",addToken(this.addParam)).then((res)=>{
                            this.addLoading=false;
                            if(res.data.success){
                                this.$message({
                                    message: this.addParam.id ? '修改成功' : '创建成功',
                                    type: 'success'
                                });
                                this.addInit();
                                this.onSearch();
                            }
                        }).catch((error)=>{
                            this.addLoading=false
                            this.$message.error(error.response.data.message);
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleEdit(id) {//修改
                this.addInit(true);
                if(this.$refs['addParam']!==undefined){
                    this.$refs['addParam'].resetFields();
                }
                if(id){
                    this.addLoading = true;
                    this.$axios.post('/express/manageClient/findExpressBanner',addToken({id})).then((res)=>{
                        this.addLoading = false;
                        console.log(res.data)
                        this.addParam=res.data.value
                    })
                }
            },
            update(e){
                this.addLoading = true;
                this.file=e.target.files[0];
                let formData = new FormData();
                formData.append('file', this.file)
                this.multipart.post('/express/public/upLoadFile', formData)
                    .then(res => {
                        this.addLoading = false;
                        if(res.data.success){
                            this.$message.success('上传成功');
                            this.addParam.imgUrl=res.data.value
                        }
                    })
            },
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

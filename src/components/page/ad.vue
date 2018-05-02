<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="searchParam.agentId" placeholder="代理商名称">
                    <el-option label="全部" value="0"></el-option>
                    <el-option v-for="item in list.agentName" :key="item.agentId" :label="item.name" :value="item.agentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
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
                label="图片">
            </el-table-column>
            <el-table-column
                prop="modifyTime"
                label="更新时间">
            </el-table-column>
            <el-table-column
                label="操作">
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

        <el-dialog title="广告" :visible.sync="dialogFormVisible">
            <form action="/express/public/upLoadFile" id="form" method="POST" enctype="multipart/form-data">
                <input type="file" name="file">
                <input type="submit" value="上传">
            </form>
            <input type="button" value="上传" @click="onUpload">


            <input type="file" value=""  id="file"  @change='onUpload'>

            <el-form :model="addParam" :rules="rules" ref="addParam" v-loading="addLoading">
                <el-form-item label="广告图片文件" prop="multipartFile" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        action="/express/public/upLoadFile"
                        :headers="{'Content-Type':'multipart/form-data'}"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转地址" prop="gotoUrl" :label-width="formLabelWidth">
                    <el-input v-model="addParam.gotoUrl"></el-input>
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
                dialogFormVisible: false,//新增修改弹窗
                addLoading:false,//添加loading
                searchLoading:false,//搜索loading
                tableData: null,
                fileList:[],
                list,
                searchParam: {
                },
                addParam:{},
                rules: {
                    merchantId: [
                        { required: true, message: '请选择商家', trigger: 'change' }
                    ],
                    serviceDay: [
                        { required: true, message: '请选择服务日期', trigger: 'change' }
                    ],
                    serviceTime: [
                        { required: true, message: '请填写取件时段', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                },
                form:{

                },
                formLabelWidth: '100px'
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            addInit(type){ // 创建成功后初始化数据
                this.dialogFormVisible=type || false;
                this.addParam={};
            },
            indexMethod(index) {//序号
                return index + 1;
            },
            onSearch(start) {//搜索
                this.searchLoading=true;
                this.searchParam.start=start || 1
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
                        console.log(this.addParam);
                        this.$axios.post("/express/manageClient/createOrMergeExpressBanner",addToken(this.addParam)).then((res)=>{
                            this.addLoading=false;
                            if(res.data.success){
                                this.$message({
                                    message: this.addParam.id ? '修改成功' : '创建成功',
                                    type: 'success'
                                });
                                this.addInit();
                                if(this.addParam.id){
                                    this.onSearch()
                                }
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
                this.addInit(true)
                if(id){
                    this.$axios.post('/express/manageClient/findExpressBanner',addToken({id})).then((res)=>{
                        console.log(res.data)
                        this.addParam=res.data.value
                    })
                }
            },
            onUpload(e){
                let param = new FormData(document.getElementById("form")); //创建form对象
                this.$axios.post('/express/public/upLoadFile',param)
                    .then(response=>{
                        console.log(response.data);
                    })

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

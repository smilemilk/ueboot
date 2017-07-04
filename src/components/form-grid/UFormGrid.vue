<template>
  <div>
    <Row v-if="formGrid.tips.title">
      <Alert type="success">
        {{formGrid.tips.title}}
        <span slot="desc" v-if="formGrid.tips.content"> {{formGrid.tips.content}}</span>
      </Alert>
    </Row>
    <Row>
      <Button type="primary" icon="android-refresh" @click="queryData">
        刷新
      </Button>
      <Button type="success" icon="plus" @click="formAdd">
        添加
      </Button>
      <Button type="error" icon="close" @click="deleteData">
        删除
      </Button>
      <template v-for="t in formGrid.toolbar">
        <Button :type="t.type" :icon="t.icon" @click="t.click(t)" :disabled="t.disabled"
                :loading="t.loading" :size="t.size" :shape="t.shape" :long="t.long" style="margin-right:3px;">{{t.name}}
        </Button>
      </template>
    </Row>
    <Row style="margin-top: 10px;">
      <Table :width="formGrid.table.width" :height="formGrid.table.height" border :columns="formGrid.table.columns"
             :data="formGrid.table.data" :stripe="formGrid.table.stripe"
             :no-data-text="formGrid.table.noDataText" @on-selection-change="onSelectionChange"></Table>
    </Row>
    <Row style="margin-top: 10px;" justify="end" type="flex">
      <Page :total="formGrid.page.total" show-elevator show-sizer @on-change="changePage"
            @on-page-size-change="changePageSize" placement="top"></Page>
    </Row>
    <Modal
      v-model="modal.showModal"
      :title="formGrid.form.modal.title"
      :closable="modal.closable"
      :mask-closable="modal.maskClosable"
      :loading="modal.loading"
      :scrollable="modal.scrollable"
      :width="modal.width">
      <Form :model="formGrid.form.data" :label-position="formGrid.form.labelPosition"
            :label-width="formGrid.form.labelWidth"
            :rules="ruleValidate" :ref="formGrid.form.name">
        <Row>
          <Col :span="24/formGrid.form.colNumber" :key="index" v-for="(item,index) in formGrid.form.columns">
          <Form-item :label="item.label" :prop="item.name">

            <Input v-model="formGrid.form.data[item.name]" :type="item.type" :placeholder="item.placeholder"
                   v-if="item.type=='text'"></Input>

            <template v-else-if="item.type=='select'">
              <Select v-model="formGrid.form.data[item.name]" :placeholder="item.placeholder">
                <Option :value="o.value" v-for="(o,index) in item.items" :key="o.index">{{o.name}}</Option>
              </Select>
            </template>

            <template v-else-if="item.type=='radio'">
              <Radio-group v-model="formGrid.form.data[item.name]">
                <Radio :label="o.label" v-for="(o,index) in item.items" :key="o.index">{{o.name}}</Radio>
              </Radio-group>
            </template>

            <template v-else-if="item.type=='date'">
              <Date-picker type="date" :placeholder="item.placeholder?item.placeholder:'选择日期'"
                           v-model="formGrid.form.data[item.name]"></Date-picker>
            </template>

            <template v-else-if="item.type=='time'">
              <Date-picker type="time" :placeholder="item.placeholder?item.placeholder:'选择时间'"
                           v-model="formGrid.form.data[item.name]"></Date-picker>
            </template>

            <template v-else-if="item.type=='checkbox'">
              <Checkbox-group v-model="formGrid.form.data[item.name]">
                <Checkbox :label="o.label" v-for="(o,index) in item.items" :key="o.index">{{o.name}}</Checkbox>
              </Checkbox-group>
            </template>

            <template v-else-if="item.type=='textarea'">
              <Input type="textarea" :placeholder="item.placeholder?item.placeholder:'请输入...'"
                     v-model="formGrid.form.data[item.name]"
                     :autosize="{minRows: item.minRows,maxRows: item.maxRows}"
              ></Input>
            </template>
            <template v-else>

            </template>

          </Form-item>
          </Col>
        </Row>
        <Row>
          <Form-item>

          </Form-item>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit()">提交</Button>
        <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
        <Button @click="cancel()" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>

</template>
<script>
  import Ajax from "../../utils/Ajax";
  import deepExtend from "deep-extend";
  import Vue from "vue";

  /**
   * FormGrid参数示例代码
   * @type {{formGrid: {}}}
   */
  const demo = {
    data: {
      //整个组件的参数设置
      options: {
        autoLoad: true,//初始化时查询数据，默认为true
        url: {
          query: "",//记录查询地址，必须使用分页查询并返回分页结果
          submit: "",//记录添加和修改提交的地址，如果提交的对象有id则为修改
          delete: "",//记录删除的提交地址，通过提交id的集合来实现一个或者多个记录
          get:"",//查看和编辑时用于查询对象的接口，参数为定义的keys
        }
      },
      //文字提示，如果title存在则显示，content可以为空
      tips: {"title": "功能提示", "content": "功能提示内容"},
      //工具栏，数组形式，每个里面可以有一个button对象，属性为iView Button属性，外加click事件
      toolbar: [{
        type: "success", name: "创建", icon: "plus", click: (button) => {
          console.log("点击事件")
        }
      }],
      //grid查询条件，采用json格式提交，name为对象的name值
      queryParams: [{
        "name": "name", "label": "姓名"
      }],
      //表单提交与修改
      form: {
        name: "",//表单名称，如果同一个页面存在多个表单时，需要指定不同的名称
        //label对齐方式
        labelPosition: "right",
        //label的宽度
        labelWidth: "80",
        //每行显示的个数
        colNumber: 2,
        //模态窗口相关配置
        modal: {
          title: "",//表单标题，默认为添加『查看、添加、修改』两个字.如果为空，则不显示标题
          showClose: true,//是否显示关闭按钮，默认为true
          width: "",//表单弹出框宽度
        },
        //表单要显示的元素
        columns: [
          {"label": "姓名", "type": "text", "name": "name", required: true},
          {"label": "年龄", "type": "text", "name": "age", required: true},
          {
            "label": "省份", "type": "select", "name": "provice",
            items: [{"name": "上海市", "value": "上海市"}, {"name": "北京市", "value": "北京市"},],
            rule: {required: true, message: '请选择省份', trigger: 'change'}
          },
        ],
        //表单提交之前（校验之后），返回如果为false,则不继续执行后续操作
        submitBefore: function () {

        },
        //表单提交之后
        submitAfter: function () {

        },
        //点击取消时的操作，默认为关闭窗口
        onCancel: function () {

        }
      },
      //结果集，所有属性为iview的Table属性（除data外），默认封装了，数据查询、分页、查看、编辑、删除功能。
      table: {
        width: "",//默认为100%
        height: "",//默认为100%
        //操作列有关参数
        operation: {
          //调用查看、编辑、删除接口时，需要传递的参数主键名称，可以有多个。默认为id
          keys: ["id"],
          //是否显示操作列
          show: true,
          //查看、编辑功能是否通过远程查询方式获取。默认为false直接用当前行数据展示
          remote: false,
          //操作按钮事件，针对查看、编辑、删除的事件。定义了事件则使用自定义事件
          events: {},
          //默认的操作列内容。可以通过复写这个来重写自己的操作列
          column: {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 160,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      let row = this.formGrid.table.data[params.index];
                      if (this.formGrid.table.optEvents.view) {
                        this.formGrid.table.optEvents.view(row, params.index);
                      }
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      if (this.formGrid.table.optEvents.edit) {
                        this.formGrid.table.optEvents.edit(params.index);
                      } else {
                        let params = this.getKeys() || "";
                        if (params === "") {
                          return;
                        }
                        //查询接口获取数据，弹出模态框

                      }
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {},
                  on: {
                    click: () => {
                      if (this.formGrid.table.optEvents.delete) {
                        this.formGrid.table.optEvents.delete(params.index);
                      } else {
                        let row = this.formGrid.table.data[params.index];
                        this.$Modal.confirm({
                          title: '删除数据',
                          content: '<span style="color:red">确定删除该记录吗？</span>',
                          onOk: () => {
                            let params = this.getKeys() || "";
                            if (params === "") {
                              return;
                            }
                            Ajax.post(this.formGrid.options.url.delete, params).then(response => {
                              this.$Loading.finish();
                              this.reloadData();
                            }, error => {
                              this.$Message.error("数据删除失败!" + error.body);
                            });
                          },
                          onCancel: () => {
                            this.$Message.info('点击了取消');
                          }
                        });
                      }
                    }
                  }
                }, '删除')
              ]);
            }
          }
        },
      },
      page: { //分页数据，默认为从第一页开始，每页大小为10条
        pageNumber: 1,
        pageSize: 10
      }
    }
  };


  export default {
    name:"UFormGrid",
    props: {
      data: {
        type: Object,
        default: function () {
          return {
            options: {autoLoad: true},
            tips: {"title": "", "content": ""},
            toolbar: [],
            queryParams: {},
            form: {},
            table: {},
            page: {
              pageNumber: 1,
              pageSize: 10
            }
          }
        }
      },
    },
    created(){
      //默认值
      let dataDefault = {
        options: {autoLoad: true, url: {}},
        tips: {"title": "", "content": ""},
        toolbar: [],
        queryParams: {},
        page: {
          pageNumber: 1,
          pageSize: 10,
          total: 0,
        },
        //表单提交与修改
        form: {
          name: "formName",//表单名称，如果同一个页面存在多个表单时，需要指定不同的名称
          //label对齐方式
          labelPosition: "right",
          //label的宽度
          labelWidth: 80,
          //每行显示的个数
          colNumber: 2,
          modal: {
            title: "",//表单标题，默认为添加『查看、添加、修改』两个字.如果为空，则不显示标题
            showClose: true,//是否显示关闭按钮，默认为true
            width: "",//表单弹出框宽度
          },
          columns: [],
          //表单提交之前（校验之后），返回如果为false,则不继续执行后续操作
          submitBefore: function (data) {
            return true;
          },
          //表单提交之后
          submitAfter: function () {
            return true;
          },
          //点击取消时的操作，默认为关闭窗口
          onCancel: function () {

          },
          data: {}//表单提交的参数
        },
        table: {
          stripe: true, noDataText: "已努力查询，但还是没找到！",
          //操作列有关参数
          operation: {
            //调用查看、编辑、删除接口时，需要传递的参数主键名称，可以有多个。默认为id
            keys: ["id"],
            //是否显示操作列
            show: true,
            //查看、编辑功能是否通过远程查询方式获取。默认为false直接用当前行数据展示
            remote: false,
            //操作按钮事件，针对查看、编辑、删除的事件。定义了事件则使用自定义事件
            events: {},
            //默认的操作列内容。可以通过复写这个来重写自己的操作列
            column: {
              title: '操作',
              key: 'action',
              fixed: 'right',
              width: 160,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        let row = this.formGrid.table.data[params.index];
                        if (this.formGrid.table.operation.events.view) {
                          this.formGrid.table.operation.events.view(row, params.index);
                        }
                      }
                    }
                  }, '查看'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        let row = this.formGrid.table.data[params.index];
                        if (this.formGrid.table.operation.events.edit) {
                          this.formGrid.table.operation.events.edit(row,params.index);
                        } else {
                          let params = this.getKeys(row) || "";
                          if (params === "") {
                            return;
                          }
                          //远程查询接口获取数据，弹出模态框
                          if(this.formGrid.table.operation.remote){
                            Ajax.post(this.formGrid.options.url.get, params).then(response => {
                                this.formGrid.form.data = response;
                                this.modal.showModal=true;
                            }, error => {
                              this.$Message.error("数据删除失败!" + error.body);
                            });
                          }else{
                            this.formGrid.form.data = deepExtend(row);
                            this.modal.showModal=true;
                          }
                        }
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                    },
                    style: {},
                    on: {
                      click: () => {
                        let row = this.formGrid.table.data[params.index];
                        if (this.formGrid.table.operation.events.delete) {
                          this.formGrid.table.operation.events.delete(row,params.index);
                        } else {
                          this.$Modal.confirm({
                            title: '删除数据',
                            content: '<span style="color:red">确定删除该记录吗？</span>',
                            onOk: () => {
                              let params = this.getKeys(row) || "";
                              if (params === "") {
                                return;
                              }
                              Ajax.post(this.formGrid.options.url.delete, params).then(response => {
                                this.reloadData();
                              }, error => {
                                this.$Message.error("数据删除失败!" + error.body);
                              });
                            },
                            onCancel: () => {
                              this.$Message.info('点击了取消');
                            }
                          });
                        }
                      }
                    }
                  }, '删除')
                ]);
              }
            }
          },
          data: []
        }
      };
      //生成表单规则校验
      let ruleValidate = {};
      if (this.data.form.columns) {
        this.data.form.columns.forEach((c) => {
          let ruleName = c.name;
          //直接写required的话，采用默认提示规则。写了rule属性则使用rule
          if (c.required && !c.rule) {
            let trigger = "blur";
            //固定的几种类型采用change事件监听
            ["select", "radio", "date", "time", "checkbox"].forEach((type) => {
              if (c.type === type) {
                trigger = "change";
              }
            });
            let rule = {required: true, message: c.label + '不能为空', trigger: trigger};
            ruleValidate[ruleName] = [rule];
          } else {
            //其他自定义格式直接采用原生格式（参见iview组件当中的form表单验证格式）
            ruleValidate[ruleName] = c.rule;
          }
        });
      }

      this.ruleValidate = ruleValidate;
      this.formGrid = deepExtend(dataDefault, this.data);
      //追加操作列
      if (this.formGrid.table.operation.show) {
          this.formGrid.table.columns.push(this.formGrid.table.operation.column);
      }
    },
    data(){
      return {
        //封装提交到后端的参数
        queryParams: {},
        //将props的data对象进行转换，防止父组件修改子组件的值
        formGrid: {form:{data:{}}},
        modal: {
          //显示模态窗口
          showModal: false,
          loading: true,
          width: 756,
          scrollable: true,
          maskClosable: false,
          closable: true,
        },
        //表单规则校验
        ruleValidate: {},
        //表格选中的项目集合
        selections: []
      }
    },
    methods: {
      //获取接口交互的主键
      getKeys(row){
        let params = {};
        let hasParams = false;
        this.formGrid.table.operation.keys.forEach((k) => {
          if (row[k]) {
            hasParams = true;
            params[k] = row[k];
          }
        });
        if (!hasParams) {
          this.$Message.error('没有配置任何keys或者当前行数据没有id属性，无法执行！');
          return
        }
        return params;
      },
      queryData(){
        //提交到后端接口，默认有一个page对象，包含分页信息。
        let params = this.queryParams;
        params["page"] = this.formGrid.page;
        this.formGrid.table.noDataText = "正在努力为您加载数据,请稍候...";
        Ajax.get(this.formGrid.options.url.query, params).then(response => {
          this.formGrid.page.total = response.total;
          this.$set(this.formGrid.table, "data", response.content)
        }, error => {
          this.formGrid.table.noDataText = "数据查询出现异常，请联系管理员！";
          this.$Message.error("数据查询异常!" + error.body);
        });
      },
      //改变分页
      changePage(pageNumber){
        this.formGrid.page.pageNumber = pageNumber;
        this.queryData();
      },
      //改变页数大小
      changePageSize(pageSize){
        this.formGrid.page.pageNumber = 1;
        this.formGrid.page.pageSize = pageSize;
        this.queryData();
      },
      //重新从第一页加载数据
      reloadData(){
        this.formGrid.page.pageNumber = 1;
        this.queryData();
      },
      //模态窗口点击确认按钮事件
      handleSubmit(){
        this.$refs[this.formGrid.form.name].validate((valid) => {
          if (valid) {
            console.log("表单提交对象");
            console.log(this.formGrid.form.data);
            if (!this.formGrid.form.submitBefore(this.formGrid.form.data)) {
              return;
            }
            Ajax.post(this.formGrid.options.url.submit, this.formGrid.form.data).then(response => {
              this.$Message.success('提交成功!');
              this.reloadData();
              this.formGrid.form.data = {};
              this.modal.showModal = false;
              this.formGrid.form.submitAfter();
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      //重置表单
      handleReset(){
        this.$refs[this.formGrid.form.name].resetFields();
      },
      //模态窗口点击取消按钮事件
      cancel(){
        this.modal.showModal = false;
        if (this.formGrid.form.onCancel) {
          this.formGrid.form.onCancel();
        }
      },
      //toolbar添加按钮事件
      formAdd(){
        this.modal.showModal = true;
        console.log(this.formGrid.form.data);
      },
      //toolbar删除按钮事件
      deleteData(){
        if (this.selections.length === 0) {
          this.$Message.error("没有选中任意数据！");
          return;
        }
      },
      //表格多选事件
      onSelectionChange(selection){
        this.selections.push(selection);
      }

    },
    mounted(){
      if (this.formGrid.options.autoLoad) {
        this.queryData();
      }
    }
  }
</script>

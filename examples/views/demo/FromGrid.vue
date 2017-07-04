<template>
  <div>
    <db-form-grid :data="formGrid"></db-form-grid>
  </div>
</template>

<script type="application/javascript">
  import DbFormGrid from "../../components/formGrid/DbFormGrid.vue"
  import Ajax from '../../utils/Ajax'

  export default {
    components: {
      DbFormGrid: DbFormGrid
    },
    data () {
      return {
        formGrid: {
          options: {
            url: {
              query: "static/demo/data.json"
            }
          },
          tips: {"title": "功能提示", "content": "FormGrid是一个结合表单查询、修改、删除等全功能的组件。方便快速实现CRUD功能!"},
          toolbar: [/*{
           type: "success", name: "创建", icon: "plus", click: (button) => {
           console.log("点击事件")
           }
           }, {
           type: "error", name: "删除", icon: "close", click: (button) => {
           console.log("close")
           }
           }*/],
          form: {
            modal: {
              title: "个人信息"
            },
            colNumber: 3,
            columns: [
              {"label": "姓名", "type": "text", "name": "name", required: true},
              {"label": "年龄", "type": "text", "name": "age", required: true},
              {
                "label": "省份", "type": "select", "name": "provice",
                items: [{"name": "上海市", "value": "上海市"}, {"name": "北京市", "value": "北京市"},],
                rule: {required: true, message: '请选择省份', trigger: 'change'}
              },
            ]
          },
          table: {
            operation: {
              keys: ["name"]
            },
            columns: [
              {
                title: '姓名',
                key: 'name',
                fixed: 'left',
                width: 100,
              },
              {
                title: '年龄',
                key: 'age',

              },
              {
                title: '省份',
                key: 'province',

              },
              {
                title: '市区',
                key: 'city',

              },
              {
                title: '地址',
                key: 'address',
              },
              {
                title: '邮编',
                key: 'zip',

              },

            ]
          }
        }
      }
    },
    methods: {
      detail: function () {
        Ajax.post("/detail", {username: "haha", password: "haha"}).then(response => {

        }, error => {

        })
      }
    }
  }
</script>

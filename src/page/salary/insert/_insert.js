import axios from '@/api/api'
import { auditStatus } from '@/config/filter'
const R = require('ramda')

export default {
  data: function () {
    return {
      modal1: false,
      modal2: false,
      sum: 0, // 奖金总额
      administrators: false, // 是否是总部人员
      dateValSpan: '', // 时间输入框
      tableTips: '', // 表格提示语
      entryTime: '', // 提交时间
      approvedTime: '', // 审批时间
      approvedRemarks: '', // 审批备注
      mainId: '', // 主要流程Id
      minMoney: 999999999,
      tokenP: '',
      listTitleStaff: [
        // 网点奖金表格数据
        {
          title: '工号',
          key: 'operatorCode'
        },
        {
          title: '员工名称',
          key: 'operatorName'
        },
        {
          title: '奖金（元）',
          render: (h, params) => {
            let content
            if (
              params.row.operatorCode !== '总计' &&
              (this.salaryType === 0 || this.salaryType === 3)
            ) {
              content = h('div', [
                h('Input', {
                  attrs: {
                    value: params.row.amount
                  },
                  class: {
                    tableCellAmount: params.row.amount >= this.minMoney * 3
                  },
                  on: {
                    'on-blur': e => {
                      this.inputChangeStaff(e, params)
                    }
                  }
                })
              ])
            } else {
              if (params.row.operatorCode === '总计') {
                content = h('span', this.sum)
              } else {
                content = h('span', params.row.amount)
              }
            }

            return content
          }
        }
      ],
      errors: [
        {
          title: '网点名称',
          key: 'orgName'
        },
        {
          title: '失败原因',
          key: 'message'
        }
      ],
      listSumTitle: [
        {
          title: '总计',
          key: 'sum'
        }
      ],
      sumData: [],
      listTitle: [
        {
          title: '网点名称',
          key: 'orgName'
        },
        {
          title: '负责人工号',
          key: 'operatorCode'
        },
        {
          title: '负责人名称',
          key: 'operatorName'
        },
        {
          title: '奖金（元）',
          render: (h, params) => {
            let content
            if (
              params.row.orgName !== '总计' &&
              (this.salaryType === 0 || this.salaryType === 3)
            ) {
              content = h('div', [
                h('Input', {
                  props: {
                    value: params.row.amount
                  },
                  on: {
                    'on-blur': e => {
                      this.inputChange(e, params)
                    }
                    // 'on-change': e => {
                    //   this.sumArr.map(items => {

                    //   })
                    //   this.inputChange(e, params)
                    // }
                  }
                })
              ])
            } else {
              if (params.row.orgName === '总计') {
                content = h('span', this.sum)
              } else {
                content = h('span', params.row.amount)
              }
            }

            return content
          }
        }
      ],
      listData: [],
      monthTitle: [],
      monthData: [],
      // dateVal: '',
      salaryType: '',
      modal2Amount: 0, // 导入成功金额合计
      errorData: [] // 导入错误后的表格数据
      // sumArr: []
    }
  },
  methods: {
    // 总部金额计算
    inputChange (e, params) {
      const val = e.target.value
      let sum = 0
      this.listData.map(item => {
        if (item.orgCode === params.row.orgCode) {
          item.amount = val
        }
        if (item.orgName !== '总计') {
          sum = R.add(sum, item.amount)
        }
      })
      this.sum = Math.round(parseFloat(sum) * 100) / 100
    },
    // 网点金额计算
    inputChangeStaff (e, params) {
      const val = e.target.value
      let sum = 0
      this.listData.map(item => {
        if (item.operatorCode === params.row.operatorCode) {
          item.amount = val
        }
        if (item.operatorCode !== '总计') {
          sum = R.add(sum, item.amount)
        }
      })
      this.sum = Math.round(parseFloat(sum) * 100) / 100
    },
    showAuth (str) {
      if (localStorage.auth.indexOf(str) !== -1) {
        return true
      } else {
        return false
      }
    },
    // // 格式化页面日期框
    // formateDate: function () {
    //   let time = new Date()
    //   let month = time.getMonth()
    //   let year = time.getFullYear()
    //   if (month === 0) {
    //     year = year - 1
    //     month = 12
    //   }
    //   this.dateVal = new Date(year, month, 0)
    // },
    // 总部人员获取审核数据
    getHeadAuditList: function () {
      axios({
        url: '/kyBonus/approved/getLastProcess',
        method: 'get'
      }).then(res => {
        let test = res.data
        this.salaryType = test.approvedStatus
        this.dateValSpan = test.bonusMonth
        this.monthData = [
          {
            rewardMonth: test.bonusMonth,
            auditType: auditStatus[test.approvedStatus]
          }
        ]
        this.mainId = test.mainId
        this.entryTime = test.createTime
        this.approvedTime = test.approvedTime
        this.approvedRemarks = test.approvedRemarks
        this.sum = 0
        if (test.data && test.data.length > 0) {
          test.data.forEach((v, k) => {
            // v.id = k
            let money = parseFloat(v.amount)
            if (money !== 0 && money < this.minMoney) {
              this.minMoney = money
            }
            // this.sumArr.push({
            //   id: k,
            //   value: v.amount
            // })
            this.sum += money
          })
          if (this.sum === 0) {
            this.minMoney = 1
          }
          // test.data.forEach((v, k) => {
          //   if (v.amount >= this.minMoney * 3) {
          //     v.cellClassName = {
          //       amount: 'table-cell-amount '
          //     }
          //   }
          // })
          test.data.push({
            orgCode: '000',
            orgName: '总计',
            operatorCode: '--',
            operatorName: '--',
            amount: Math.round(parseFloat(this.sum) * 100) / 100
          })
        }
        this.listData = test.data

        switch (test.approvedStatus) {
          case 0:
            this.tableTips = '请在此表格中输入或者Excel导入奖金分配金额:'
            break
          default:
            this.tableTips = '奖金分配金额明细:'
            break
        }
      })
    },
    // 网点人员分配列表
    getStaffAuditList () {
      axios({
        url: '/kyBonus/approved/getOutletsEntry',
        methods: 'get'
      }).then(res => {
        this.monthData = res.data.data
      })
    },
    // 网点人员分配奖金
    getstaffAuditdetail () {
      axios({
        url: '/kyBonus/approved/queryBonusDetail?mainId=' + this.mainId,
        methods: 'get'
      }).then(res => {
        let test = res.data
        this.sum = 0
        if (test.data && test.data.length > 0) {
          test.data.forEach((v, k) => {
            let money = parseFloat(v.amount)
            if (money !== 0 && money < this.minMoney) {
              this.minMoney = money
            }
            this.sum += money
          })
          test.data.forEach((v, k) => {
            if (v.amount >= this.minMoney * 3) {
              v.cellClassName = {
                amount: 'table-cell-amount '
              }
            }
          })
          test.data.push({
            operatorCode: '总计',
            operatorName: '--',
            amount: Math.round(parseFloat(this.sum) * 100) / 100
          })
        }
        this.listData = test.data

        switch (test.approvedStatus) {
          case 0:
            this.tableTips = '请在此表格中输入或者Excel导入奖金分配金额:'
            break
          default:
            this.tableTips = '奖金分配金额明细:'
            break
        }
      })
    },
    // 提交审核
    commitAudit () {
      this.listData.pop()

      if (this.listData <= 0) {
        this.$Message.error('无任何可提交数据')
        return
      }

      axios({
        url: '/kyBonus/approved/entryApproved',
        method: 'post',
        data: {
          type: this.administrators,
          mainId: this.mainId,
          details: this.listData
        }
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('审核通过')
          this.$router.go(0)
        } else {
          this.$Message.error(res.data)
          // setTimeout(() => {
          //   this.loading = false
          //   this.$nextTick(() => {
          //     this.loading = true
          //   })
          // }, 500)
        }
      })
    },
    downExcel () {
      let url =
        '/kyBonus/approved/downloadBonusDetail?mainId=' +
        this.mainId +
        '&type=' +
        this.administrators
      window.open(url)

      // axios({
      //   url: '/kyBonus/approved/downloadBonusDetail?mainId=' +
      //   this.mainId +
      //   '&type=' +
      //   this.administrators,
      //   method: 'get'
      // }).then(res => {
      //   debugger
      // })
    },
    uploadFileFun (res, file) {
      if (res.status !== 200) {
        this.$Message.error(res.message)
        return
      }
      if (res.data && res.data.length > 0) {
        this.sum = 0
        res.data.forEach((v, k) => {
          let money = parseFloat(v.amount)
          if (money !== 0 && money < this.minMoney) {
            this.minMoney = money
          }
          this.sum += money
        })
        if (this.administrators !== 1) {
          res.data.forEach((v, k) => {
            if (v.amount >= this.minMoney * 3) {
              v.cellClassName = {
                amount: 'table-cell-amount '
              }
            }
          })
        }
        if (this.administrators === 2) {
          res.data.push({
            operatorCode: '总计',
            operatorName: '--',
            amount: Math.round(parseFloat(this.sum) * 100) / 100
          })
        } else {
          res.data.push({
            orgCode: '000',
            orgName: '总计',
            operatorCode: '--',
            operatorName: '--',
            amount: Math.round(parseFloat(this.sum) * 100) / 100
          })
        }
      }
      // if (res.error && res.error.length > 0) {
      this.listData = res.data
      this.errorData = res.error
      this.modal2Amount = res.amount
      this.modal2 = true
      // }
    },
    uploadFileErr () {
      this.$Message.error('上传文件失败')
    },
    getExpenses () {
      this.$Message.error('获取报销数据暂无')
    }
    // rowClassName (row, index) {
    //   // console.log('row.operatorCode', row.operatorCode)
    //   // console.log('this.minMoney', this.minMoney)
    //   // console.log('row.amount', row.amount)
    //   if (this.administrators === 1) {
    //     if (
    //       row.orgName !== '总计' &&
    //       this.minMoney !== 0 &&
    //       row.amount >= parseInt(this.minMoney) * 3
    //     ) {
    //       return 'money-primary'
    //     } else {
    //       return ''
    //     }
    //   } else {
    //     if (
    //       row.operatorCode !== '总计' &&
    //       this.minMoney !== 0 &&
    //       row.amount >= parseInt(this.minMoney) * 3
    //     ) {
    //       return 'money-primary'
    //     } else {
    //       return ''
    //     }
    //   }
    // }
  },
  mounted () {
    this.administrators = +localStorage.type
    this.tokenP = localStorage.getItem('token')
    if (this.administrators === 1) {
      this.monthTitle = [
        {
          title: '奖励月份',
          key: 'rewardMonth'
        },
        {
          title: '分发状态',
          key: 'auditType'
        }
      ]
      this.getHeadAuditList()
    } else {
      this.monthTitle = [
        {
          title: '机构名称',
          key: 'orgName'
        },
        {
          title: '奖励月份',
          key: 'bonusMonth'
        },
        {
          title: '奖金限额',
          key: 'amount'
        },
        {
          title: '分发状态',
          // key: 'approvedStatus'
          render: (h, params) => {
            let content
            content = h('div', [
              h(
                'a',
                {
                  on: {
                    click: e => {
                      this.mainId = params.row.mainId
                      this.salaryType = params.row.approvedStatus
                      this.entryTime = params.row.entryTime
                      this.approvedTime = params.row.approvedTime
                      this.approvedRemarks = params.row.approvedRemarks
                      switch (params.row.approvedStatus) {
                        case 0:
                          this.tableTips =
                            '请在此表格中输入或者Excel导入奖金分配金额:'
                          break
                        default:
                          this.tableTips = '奖金分配金额明细:'
                          break
                      }
                      this.getstaffAuditdetail()
                    }
                  }
                },
                auditStatus[params.row.approvedStatus]
              )
            ])

            return content
          }
        }
      ]
      this.getStaffAuditList()
    }
    // if (this.salaryType !== '0') {
    // }
  }
  // filters: {
  //   formateAuditStatus (val) {
  //     return auditStatus[val]
  //   }
  // }
}

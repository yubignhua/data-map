interface taskListState {
    count: number
    key: string
    name: string
}

interface ISortParam {
    prop: string, // 属性
    order: string, // 排序规则
    column: any, //
}

interface IDtsRankParm {
    year: string,
    term: string,
    per_page: number,
    page:number,
    sort_column: string,
    sort_asc: string,
    type: string
}

interface IReqParams {
    per_page: number,
    [key: string]: any
}
interface IOrderConf {
    readonly ascending: number,
    readonly descending: number
  }

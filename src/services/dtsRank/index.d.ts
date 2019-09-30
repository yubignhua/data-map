/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-23 15:04:34
 * @LastEditTime: 2019-09-17 10:38:58
 * @LastEditors: Please set LastEditors
 */
interface IEditUinit {
    // 套餐 id
    unit_id:number,
    // 选择设备 id 集合
    device_ids:string,
}

interface IDtsRankParm {
    year: string,
    term: string,
    page:number,
    per_page: number,
    sort_column: string,
    sort_asc: string,
    type:string
}

interface IRadarParam{
    school_id?:number,
    year?:number,
    term?:number,
    per_page?:number,
    type?:number,
    keyword?:string,
    page: number,
}

interface ISchDetainParam {
    school_id:number
}

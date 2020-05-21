import {Fun,Unit,List,Empty,Cons, ConvertStringsToNumber,GetColumnValue, Pair} from  "../utils/utils"//import tool
import { Row} from "../data/models"
/******************************************************************************* 
    * @Operations like where, oderby and groupby
    * Note: trying to use Fun, but I'm not going to do Fun in Fun
*******************************************************************************/

export interface OperationType{
    Where: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    GroupBy: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    Orderby: (i:List<Row<Unit>>)=> List<Row<Unit>>
}

let OperationExecute = function(w: (i:List<Row<Unit>>)=> List<Row<Unit>>,g: (i:List<Row<Unit>>)=> List<Row<Unit>>, o: (i:List<Row<Unit>>)=> List<Row<Unit>>) : OperationType{
    return{
        Where:w,
        GroupBy:g,
        Orderby:o
    }
}

export let OperationUnit = function() : OperationType{ //if not selected than just return the row without touching
    let unit = (i:List<Row<Unit>>)=> i
    return OperationExecute(unit,unit,unit)
}

/******************************************************************************* 
    * @groupby
    * Note: Group by could/should contain more 'aggregate functions' (COUNT, MAX, MIN, SUM, AVG)
*******************************************************************************/
export interface GroupByClauses{
    GroupBy: (i:List<Row<Unit>>)=> List<Row<Unit>>,
}

export let GroupByClauses = function(columnName:string) : GroupByClauses{
    return{
        GroupBy:(list:List<Row<Unit>>) => (GroupByTool(list,columnName))
        }
}

let GroupByTool = function(l:List<Row<Unit>>, columnName: string) : List<Row<Unit>> {
    if(l.kind == "Cons"){
        let searchVal = GetColumnValue(l.head, columnName)
        let result = FilterOut(searchVal,l.tail,columnName)
        //the result contains a list without the search value(l.head), this will be done until no values are left
        return Cons(l.head,GroupByTool(result,columnName))
    }else{
        return Empty()
    }
}
let FilterOut = function(searchVal:string,l:List<Row<Unit>>, columnName: string) : List<Row<Unit>>{
    if(l.kind == "Cons"){
        let compareVal = GetColumnValue(l.head, columnName)
        if(compareVal == searchVal){
            return FilterOut(searchVal,l.tail,columnName)
        }else{
            return Cons(l.head,FilterOut(searchVal,l.tail,columnName))
        }
    }else{
        return Empty()
    }
}
/******************************************************************************* 
    * @Whereclause
    * Note: trying to use Fun, but I'm not going to do Fun in Fun
*******************************************************************************/
export interface WhereClauses{
    Equal: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    GreaterThan: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    LessThan: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    NotEqual: (i:List<Row<Unit>>)=> List<Row<Unit>>,
}
export let WhereClauses = function(columnName:string,value:string) : WhereClauses{
    return{
        Equal:(list:List<Row<Unit>>) => {
              return WhereFun(list,columnName,Fun<string,boolean>(x=>{
                    if(x == value){
                        return true
                    }else{
                        return false
                    }
            }))
        },
        GreaterThan:(list:List<Row<Unit>>) => {
            return WhereFun(list,columnName,Fun<string,boolean>(x=>{
                let i = ConvertStringsToNumber(x,value)
                if(i.fst != NaN && i.snd != NaN){
                    if(i.fst > i.snd){ //needed a nested if...why???????
                        return true 
                    }else{
                        return false
                    }
                }
                else if(x > value){
                    return true
                }else{
                    return false
                }
            }))
        },
        LessThan:(list:List<Row<Unit>>) => {
            return WhereFun(list,columnName,Fun<string,boolean>(x=>{
                let i = ConvertStringsToNumber(x,value)
                if(i.fst != NaN && i.snd != NaN){
                    if(i.fst < i.snd){ //needed a nested if...why???????
                        return true 
                    }else{
                        return false
                    }
                }
                else if(x < value){
                    return true
                }
                return false
            }))
        },
        NotEqual:(list:List<Row<Unit>>) => {
            return WhereFun(list,columnName,Fun<string,boolean>(x=>{
                if(x != value){
                    return true
                }else{
                    return false
                }
            }))
        }
    }
}

let WhereFun =  function(i:List<Row<Unit>>,columnName:string,targetvalue:Fun<string,boolean>) : List<Row<Unit>>{
    if(i.kind == "Cons"){
        let found = 0 //this can be seen as a boolean
        let row : List<Row<Unit>> = null!//the placeholder is null (yes, reusing a var)
        i.head.columns.map(x=>
            {
                if(x.name == columnName){
                    if(targetvalue.f(String(x.value))){
                        found++; //so, the value is found you say?
                        row = Cons(i.head,WhereFun(i.tail,columnName,targetvalue)) 
                    }
                }
            })
        if(found != 0){
            return row //if found return value
        }
        return WhereFun(i.tail,columnName,targetvalue) //if not found go to the next item
    }else{
        return Empty()
    }
}
/******************************************************************************* 
    * @OrderByclause
    * Note: to option ASC and DESC
*******************************************************************************/
export type OrderByOptions = "ASC" | "DESC"

export interface OrderByclause{
    Orderby:(list:List<Row<Unit>>) => List<Row<Unit>>
}

export let OrderByclause = function(columnName:string,  o: OrderByOptions) : OrderByclause{
    return{
        Orderby:(list:List<Row<Unit>>) : List<Row<Unit>> =>{
            return OrderList(list,columnName,o)
        }
    }
}

let OrderList = function(list:List<Row<Unit>>,columnName: string, o: OrderByOptions): List<Row<Unit>>{
    if(list.kind == "Cons" && list.tail.kind == "Cons"){ //if it has two values to switch
        let tmp1 =  OrderListTool(list, list.head,columnName,o) //get the lowest or highest value and a list without that value
        return Cons(tmp1[1], OrderList(tmp1[0], columnName, o)) //return the con
    }
    else if(list.kind == "Cons"){
        return Cons(list.head,Empty()) //only one value left? So, stop sorting
    }else{
        return Empty()
    }
}

let OrderListTool = function(list:List<Row<Unit>>,value : Row<Unit>,columnName: string, o: OrderByOptions): [List<Row<Unit>>,Row<Unit>]{
    if(list.kind == "Cons" && list.tail.kind== "Empty"){
        return [Empty(), value]
    }
    else if(list.kind == "Cons" && list.tail.kind == "Cons"){
        let x = o == "ASC" ? OrderTwoRowsASC(list.tail.head,value,columnName) : OrderTwoRowsDESC(list.tail.head,value,columnName)
        let tmp1 = OrderListTool(list.tail,x.fst,columnName,o)
        return [Cons(x.snd,tmp1[0]),tmp1[1]]
    }
    else{
        return [Empty(), value]
    }
}

let OrderTwoRowsDESC = function(value1: Row<Unit>, value2: Row<Unit>, columnName: string) : Pair<Row<Unit>, Row<Unit>>{
    let v1 = GetColumnValue(value1, columnName)
    let v2 = GetColumnValue(value2, columnName)
    let vN = ConvertStringsToNumber(v1,v2)

    if(vN.fst != NaN && vN.snd != NaN && vN.fst < vN.snd){
        return {fst: value2, snd:value1}
    }else if(vN.fst != NaN && vN.snd != NaN){
        //if vN[0] is not bigger than vN[1] return value1,value2 order instead of trusting string (string i.e. 1,11,9)
        return {fst: value1, snd:value2}
    }
    if(v1 < v2){   
        return {fst: value2, snd:value1}
    }
    return {fst: value1, snd:value2}

}
let OrderTwoRowsASC = function(value1: Row<Unit>, value2: Row<Unit>, columnName: string) : Pair<Row<Unit>, Row<Unit>>{
    let v1 = GetColumnValue(value1, columnName)
    let v2 = GetColumnValue(value2, columnName)
    let vN = ConvertStringsToNumber(v1,v2)

    if(vN.fst != NaN && vN.snd != NaN && vN.fst > vN.snd){
        return {fst: value2, snd:value1}
    }
    if(v1 > v2){   
        return {fst: value2,snd:value1}
    }
    return {fst: value1, snd:value2}
}
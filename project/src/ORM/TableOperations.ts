import {Fun,Unit,List,Empty,Cons, ConvertStringsToNumber,GetColumnValue} from  "../utils/utils"//import tool
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

export let OperationUnit = function() : OperationType{
    let unit = (i:List<Row<Unit>>)=> i
    return OperationExecute(unit,unit,unit)
}

/******************************************************************************* 
    * @groupby
    * Note: 
*******************************************************************************/
//boolean is to say: Hé the values needed to switched!
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
              return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                    if(x == value){
                        return true
                    }else{
                        return false
                    }
            }))
        },
        GreaterThan:(list:List<Row<Unit>>) => {
            return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                let i = ConvertStringsToNumber(x,value)
                if(i[0] != NaN && i[1] != NaN){
                    if(i[0] > i[1]){ //needed a nested if...why???????
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
            return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                let i = ConvertStringsToNumber(x,value)
                if(i[0] != NaN && i[1] != NaN){
                    if(i[0] < i[1]){ //needed a nested if...why???????
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
            return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                if(x != value){
                    return true
                }else{
                    return false
                }
            }))
        }
    }
}

let WhereLambda =  function(i:List<Row<Unit>>,columnName:string,targetvalue:Fun<string,boolean>) : List<Row<Unit>>{
    if(i.kind == "Cons"){
        let found = 0
        let row : List<Row<Unit>> = null!
        i.head.columns.map(x=>
            {
                if(x.name == columnName){
                    if(targetvalue.f(String(x.value))){
                        found++;
                        row = Cons(i.head,WhereLambda(i.tail,columnName,targetvalue)) 
                    }
                }
            })
        if(found != 0){
            return row 
        }
        return WhereLambda(i.tail,columnName,targetvalue)
    }else{
        return Empty()
    }
}
/******************************************************************************* 
    * @OrderByclause
    * Note: 
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
    if(list.kind == "Cons" && list.tail.kind == "Cons"){
        let tmp1 =  OrderListTool(list, list.head,columnName,o)
        return Cons(tmp1[1], OrderList(tmp1[0], columnName, o))
    }
    else if(list.kind == "Cons"){
        return Cons(list.head,Empty())
    }else{
        return Empty()
    }
}

let OrderListTool = function(list:List<Row<Unit>>,value : Row<Unit>,columnName: string, o: OrderByOptions): [List<Row<Unit>>,Row<Unit>]{
    if(list.kind == "Cons" && list.tail.kind== "Empty"){
        return [Empty(), value]
    }
    else if(list.kind == "Cons" && list.tail.kind == "Cons"){
        let x = OrderRows(list.tail.head,value,columnName,o)
        let tmp1 = OrderListTool(list.tail,x[0],columnName,o)
        return [Cons(x[1],tmp1[0]),tmp1[1]]
    }
    else{
        return [Empty(), value]
    }
}

//boolean is to say: Hé the values needed to switched!
let OrderRows = function(value1: Row<Unit>, value2: Row<Unit>, columnName: string, o: OrderByOptions) : [Row<Unit>, Row<Unit>]{
    let v1 = GetColumnValue(value1, columnName)
    let v2 = GetColumnValue(value2, columnName)
    let vN = ConvertStringsToNumber(v1,v2)

    if(o == "DESC"){
        if(vN[0] != NaN && vN[1] != NaN && vN[0] < vN[1]){
            return [value2,value1]
        }else if(vN[0] != NaN && vN[1] != NaN){
            //if vN[0] is not bigger than vN[1] return value1,value2 order instead of trusting string (string i.e. 1,11,9)
            return [value1,value2]
        }
        if(v1 < v2){   
            return [value2,value1]
        }
    }else{
        if(vN[0] != NaN && vN[1] != NaN && vN[0] > vN[1]){
            return [value2,value1]
        }
        if(v1 > v2){   
            return [value2,value1]
        }
    }
    return [value1,value2]
}
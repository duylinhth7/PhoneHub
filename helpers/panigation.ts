
interface ObjectPanigation {
    currentPage: number,
    limitItems: number,
    skipItems? : number,
    totalPages? : number
}
const panigationHelper = (objectPanigation: ObjectPanigation, query: Record<string, any>, countProducts:number) => {
    if(query.page){
        objectPanigation.currentPage = parseInt(query.page);
    };
    objectPanigation.skipItems = (parseInt(query.page) -1) * (objectPanigation.limitItems);

    objectPanigation.totalPages = Math.ceil(countProducts/objectPanigation.limitItems);

    return objectPanigation;
}
export default panigationHelper;

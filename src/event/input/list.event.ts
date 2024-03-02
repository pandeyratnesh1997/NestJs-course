

export class ListEvents {
    when: whenEventFilterEnum = whenEventFilterEnum.All;
    page: number = 1;
}


export enum whenEventFilterEnum {
    All = 1,
    Today = 1,
    Tomorrow = 1,
    ThisWeek = 1,
    NextWeek = 1,
}
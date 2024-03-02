import { SelectQueryBuilder } from "typeorm";

export interface PaginationOptions {
    limit: number;
    currentPage: number;
    total? : boolean;
}

export interface PaginationResult <T> {
    first : number;
    last : number;
    limit : number;
    currentPage : number;
    total? : number;
    data : T[];
}

export async function paginate<T>(qb : SelectQueryBuilder<T>,
     options: PaginationOptions = {
        limit: 10,
        currentPage: 1
     }): Promise<PaginationResult<T>> {
        const offset = (options.currentPage - 1) * options.limit;
        // const data = await qb.offset(offset).limit(options.limit).getMany();
        const data = await qb.limit(options.limit).offset(offset).getMany();
        console.log("data===" , data)

        const total = options.total ? await qb.getCount() : null

        return {
            first: offset + 1,
            last: offset + data.length,
            limit: options.limit,
            currentPage: options.currentPage,
            total,
            data
        }
     }
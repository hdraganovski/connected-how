import dbpediaService from "@/services/dbpediaService"

export default (ctx, inject) => {
    inject("dbpediaService", dbpediaService(ctx.$axios))
}
import { https } from '@/https/https'
/**
 * 猜你喜欢
 */
export const getHomeGoodsGuessLikeAPI = (page, pageSize) => {
  return https({
    method: 'GET',
    url: `/book/guessLike?page=${page}&pageSize=${pageSize}`,
  })
}
export const getRecommendationsAPI = () => {
  return https({
    method: 'GET',
    url: `/recommend/getRecommendations?user_id=${32}`,
  })
}
// 获取总的页数
export const getHomegetTotalPageAPI = () => {
  return https({
    method: 'GET',
    url: `/book/getTotalPage`,
  })
}

// 获取随机name
export const getHomeRandomNameAPI = () => {
  return https({
    method: 'GET',
    url: `/book/getGuessName`,
  })
}

import * as types from './mutation-types'

// actions 可以同时提交多个mutations
// 修改state中歌曲信息
export const selectPlay = function({commit, state}, {list, index}){
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_lIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLSYING_STATE, true)
}
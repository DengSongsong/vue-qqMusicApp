import * as types from './mutation-types'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/utils'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// actions 可以同时提交多个mutations
// 修改state中歌曲信息
export const selectPlay = function({commit, state}, {list, index}){
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_lIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_lIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_lIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLSYING_STATE, true)
}
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_lIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLSYING_STATE, true)
}
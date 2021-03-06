import { palyMode } from '@/common/js/config'
import { playMode } from '../common/js/config';
import { loadSearch, loadPlay, loadFavorite } from '@/common/js/cache'

// 状态数据 原始数据
const state = {
  // 歌手信息
  singer: {},
  // 默认不播放
  playing: false,
  // 全屏播放 默认不全屏
  fullScreen: false,
  // 歌曲播放列表
  playList: [],
  // 顺序播放列表
  sequenceList: [],
  // 播放类型 默认顺序播放
  mode: playMode.sequence,
  // 当前歌曲索引
  currentIndex: -1,
  // 歌单
  disc: {},
  // 榜单 
  topList: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlay(),
  // 收藏
  favoriteList: loadFavorite()
}
export default state
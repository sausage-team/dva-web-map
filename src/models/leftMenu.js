
export default {
  namespace: 'leftMenu',
  state: {
    openKeys:['menu1'],
    collapsed: false,
  },
  reducers: {
    setOpenKeys(state, {payload:openKeys}) {
      state.openKeys=openKeys;
      return { ...state };
    },
    setCollapsed(state, { payload: collapsed }) {
      state.collapsed = collapsed;
      return { ...state};
    },
  },
  effects: {},
  subscriptions: {},
};

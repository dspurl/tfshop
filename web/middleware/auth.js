export default function ({redirect, store}) {
  if (!store.state.hasLogin) {
    return redirect('/pass/login')
  }
}

import './Sidebar.css'

export interface SidebarProps{
  setPage: ( page: number ) => number
}

export let Sidebar = ( props: SidebarProps ) => {
  return (
    <>
      <div app-sidebar>
        <div app-sidebar-tab onClick={() => props.setPage(0)}>Actions</div>
        <div app-sidebar-tab onClick={() => props.setPage(1)}>Relays</div>
        <div app-sidebar-tab onClick={() => props.setPage(2)}>Debug</div>

        <div app-sidebar-tab app-sidebar-tab-dropped onClick={() => props.setPage(3)}>Settings</div>
      </div>
    </>
  )
}
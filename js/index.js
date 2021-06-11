var toggleSidebar=false
const displayMenu=()=>{
    if(!toggleSidebar)
    {
        document.querySelector('.sidebar-container').style.display='block'
        toggleSidebar=true
        document.querySelector('.hamburger').innerHTML='<i class="fas fa-times"></i>'
        document.querySelector('.hamburger').style.color='#444'
    }
    else
    {
        document.querySelector('.sidebar-container').style.display='none'
        toggleSidebar=false
        document.querySelector('.hamburger').innerHTML='<i class="fas fa-bars"></i>'
        document.querySelector('.hamburger').style.color='#fff'
    }
}



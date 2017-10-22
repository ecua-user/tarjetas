window.addEventListener('load',opciones);

function opciones(){
    document.getElementById('opciones').innerHTML=`
    <div class="margen-admin hidden-lg hidden-md">
        <ul class="nav justify-content-center">
            <li class="nav-item" title="Ingresar vendedor">
                <a class="nav-link  active" href="/admin/ingresar-vendedor">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-usd" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Modificar vendedor">
                <a class="nav-link " href="/admin/modificar-vendedor">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-gbp" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Asignación vendedor">
                <a class="nav-link " href="/admin/asignar-vendedor">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Ingresar local">
                <a class="nav-link " href="/admin/ingresar-local">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item " title="Modificar o eliminar local">
                <a class="nav-link " href="/admin/modificar-local">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Registrar tarjeta">
                <a class="nav-link " href="/admin/reg-tarj">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-credit-card" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Modificar tarjeta">
                <a class="nav-link " href="/admin/mod-tarj">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-flash" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Eliminar usuario">
                <a class="nav-link " href="/admin/eliminar-usuario">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-fire" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Reportes por Vendedor">
                <a class="nav-link " href="/admin/reporte-vendedor">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-stats" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Reportes por usuario">
                <a class="nav-link " href="/admin/reporte-usuario">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Reportes por local">
                <a class="nav-link " href="/admin/reporte-local">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                            <span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Reporte por tarjeta">
                <a class="nav-link " href="/admin/reporte-tarjeta">
                    <button type="button" class="btn btn-primary" aria-label="Left Align">
                        <span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item " title="Gestionar Slider">
                <a class="nav-link" href="/admin/slider">
                    <button type="button" class="btn btn-info" aria-label="Left Align">
                        <span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
            <li class="nav-item" title="Cambiar contraseña">
                <a class="nav-link " href="/admin/password">
                    <button type="button" class="btn btn-warning" aria-label="Left Align">
                        <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
                    </button>
                </a>
            </li>
        </ul>
    </div>`;
}
import { Component, OnInit } from '@angular/core';
import { VentaService, Venta } from '../venta.service';

interface TotalAgrupado {
  clave: string;
  total: number;
}

@Component({
  selector: 'app-resumen',
  standalone: false,
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {
  ventas: Venta[] = [];
  filtradas: Venta[] = [];
  error = '';
  cargando = false;
  expandedIndex: number | null = null;
  
  fechaDesde: string = '';
  fechaHasta: string = '';
  busquedaProducto: string = '';

  modoAgrupacion: 'dia' | 'semana' | 'mes' = 'dia';
  totalesAgrupados: TotalAgrupado[] = [];

  //PAGINACION
  paginaActual = 1;
  ventasPorPagina = 5;

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.cargando = true;
    this.error = '';
    
    this.ventaService.getVentas().subscribe({
      next: (data) => {
        console.log('Ventas recibidas en el componente:', data);
        this.ventas = data.slice();
        // Ordenar las ventas por fecha, las más recientes primero
        this.ventas.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateB.getTime() - dateA.getTime();
        });

        this.filtradas = this.ventas;
        this.calcularTotales();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.error = error.message || 'Error al cargar las ventas';
        this.ventas = [];
        this.filtradas = [];
        this.cargando = false;
      }
    });
  }

  toggleDetalle(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  aplicarFiltros(): void {
    this.filtradas = this.ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha);
      let cumpleFecha = true;
      let cumpleProducto = true;

      if (this.fechaDesde) {
        cumpleFecha = fechaVenta >= new Date(this.fechaDesde);
      }

      if (this.fechaHasta && cumpleFecha) {
        const hasta = new Date(this.fechaHasta);
        hasta.setHours(23, 59, 59);
        cumpleFecha = fechaVenta <= hasta;
      }

      if (this.busquedaProducto.trim()) {
        const busqueda = this.busquedaProducto.toLowerCase().trim();
        cumpleProducto = venta.detalles.some(detalle => 
          detalle.producto?.nombre.toLowerCase().includes(busqueda)
        );
      }

      return cumpleFecha && cumpleProducto;
    });

    this.calcularTotales();
  }

  calcularTotales(): void {
    this.totalesAgrupados = [];
    const ventasPorPeriodo = new Map<string, number>();

    this.filtradas.forEach(venta => {
      const fecha = new Date(venta.fecha);
      let clave = '';

      switch (this.modoAgrupacion) {
        case 'dia':
          const dia = fecha.getDate().toString().padStart(2, '0');
          const mesDia = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const anioDia = fecha.getFullYear();
          clave = `${dia}-${mesDia}-${anioDia}`;
          break;
        case 'semana':
          const primerDiaSemana = new Date(fecha);
          primerDiaSemana.setDate(fecha.getDate() - fecha.getDay());
          const diaSemana = primerDiaSemana.getDate().toString().padStart(2, '0');
          const mesSemana = (primerDiaSemana.getMonth() + 1).toString().padStart(2, '0');
          const anioSemana = primerDiaSemana.getFullYear();
          clave = `${diaSemana}-${mesSemana}-${anioSemana}`;
          break;
        case 'mes':
          clave = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
      }

      ventasPorPeriodo.set(clave, (ventasPorPeriodo.get(clave) || 0) + venta.total);
    });

    this.totalesAgrupados = Array.from(ventasPorPeriodo.entries())
      .map(([clave, total]) => ({
        clave,
        total
      }))
      .sort((a, b) => {
        let dateA: Date;
        let dateB: Date;

        if (this.modoAgrupacion === 'dia' || this.modoAgrupacion === 'semana') {
          // Parse DD-MM-YYYY
          const [dayA, monthA, yearA] = a.clave.split('-').map(Number);
          dateA = new Date(yearA, monthA - 1, dayA);
          const [dayB, monthB, yearB] = b.clave.split('-').map(Number);
          dateB = new Date(yearB, monthB - 1, dayB);
        } else {
          // Parse YYYY-MM
          dateA = new Date(a.clave);
          dateB = new Date(b.clave);
        }

        return dateB.getTime() - dateA.getTime(); // Orden descendente (más reciente primero)
      });
  }

  exportarResumen(): void {
    const datos = this.filtradas.map(venta => ({
      ID: venta.id,
      Fecha: new Date(venta.fecha).toLocaleDateString(),
      Total: venta.total,
      'Cantidad Items': venta.detalles.length,
      Detalles: venta.detalles.map(d => 
        `${d.producto?.nombre} (${d.cantidad})`
      ).join(', ')
    }));

    const headers = Object.keys(datos[0]);
    const csv = [
      headers.join(','),
      ...datos.map(row => headers.map(header => JSON.stringify(row[header as keyof typeof row])).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resumen_ventas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  get totalPaginas(): number {
    return Math.ceil(this.filtradas.length / this.ventasPorPagina);
  }
  
  get ventasPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.ventasPorPagina;
    return this.filtradas.slice(inicio, inicio + this.ventasPorPagina);
  }
}

import { UtilsService } from '../../../services/utils.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Specialty } from 'src/app/classes/specialty';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-elegir-especialidad',
  templateUrl: './elegir-especialidad.component.html',
  styleUrls: ['./elegir-especialidad.component.scss'],
})
export class ElegirEspecialidadComponent implements OnInit {
  @Output() elegirEspecialidad = new EventEmitter<Specialty[]>();
  @Input() permitirAniadir = false;

  especialidades: any[] = [];
  seleccionadas: any[] = [];

  nuevo = '';
  imagen?: File;

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.utilsService.getSpecialties().subscribe((docs) => {
      this.especialidades = [];
      docs.forEach((doc) => {
        this.especialidades.push({ ...doc, checked: false, horarios: [] });
      });
    });
  }

  tocar(e: any) {
    const index = this.especialidades.indexOf(e);
    if (index != -1) {
      this.especialidades[index].checked = !this.especialidades[index].checked;
      if (e.checked) {
        this.seleccionar(e);
      } else {
        this.deseleccionar(e);
      }
    }

    this.elegirEspecialidad.emit(this.seleccionadas);
  }

  seleccionar(especialidad: Specialty) {
    this.seleccionadas.push(especialidad);
    console.log(this.seleccionadas);
  }

  deseleccionar(especialidad: Specialty) {
    const index = this.seleccionadas.indexOf(especialidad);
    if (index >= 0) {
      this.seleccionadas.splice(index, 1);
    }
    console.log(this.seleccionadas);
  }

  Aniadir() {
    if (this.nuevo.length > 0 && this.imagen !== undefined) {
      const e = new Specialty(this.nuevo, '');
      this.utilsService.aniadirEspecialidad(e, this.imagen);
      this.nuevo = '';
      this.imagen = undefined;
    } else {
      Swal.fire(
        'Error!',
        'No puede añadir una especialidad con un campo vacio',
        'error'
      );
    }
  }

  cambiarImagen($event: any) {
    if ($event.target.files.length > 0) {
      this.imagen = $event.target.files[0];
    }
  }
}

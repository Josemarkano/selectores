import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required ],
    pais    : ['', Validators.required ],
    frontera: ['', Validators.required ]
  })

  //llenar selectores
  regiones : string[]    = [];
  paises   : PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //cuando cambia la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
        this.miFormulario.get('pais')?.reset('')
        this.cargando = true
      }),
        switchMap( region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe( paises => {
        this.cargando = false
        this.paises = paises} )

      //cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.fronteras = []
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
      )
      .subscribe( paises => {
        this.cargando = false
        this.fronteras = paises;
      })

  }

  guardar() {
    console.log(this.miFormulario.value);
    
  }

}

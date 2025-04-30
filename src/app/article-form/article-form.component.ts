import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'Services/products.service';
import { Product } from '../Modeles/products';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {

  form: FormGroup;
  idCourant!: number;
  categories: string[] = ["men's clothing", "jewelery", "electronics", "women's clothing"];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private PS: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.params['id'];
    this.idCourant = idParam ? parseInt(idParam, 10) : 0;
    this.isEditMode = !!this.idCourant;
    console.log('ID courant :', this.idCourant);

    if (this.isEditMode) {
      this.PS.getProductById(this.idCourant).subscribe(a => {
        this.form.patchValue({
          title: a.title,
          price: a.price,
          description: a.description,
          category: a.category,
          image: a.image
        });
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const productData: Product = {
        ...this.form.value,
        id: this.isEditMode ? this.idCourant : undefined,
        isFavorite: false
      };

      if (this.isEditMode) {
        this.PS.UpdateProduct(this.idCourant.toString(), productData)
          .subscribe(() => {
            this.router.navigate(['/listesproduits']);
          });
      } else {
        this.PS.AddProduct(productData).subscribe(() => {
          this.router.navigate(['/listesproduits']);
        });
      }
    }
  }
}

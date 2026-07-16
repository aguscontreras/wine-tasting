import { Component, effect, inject, OnDestroy } from '@angular/core';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { Loading } from '../../services/loading';

@Component({
  selector: 'app-global-loading',
  imports: [HlmSpinnerImports],
  template: `
    @if (loading.visible()) {
      <div
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 supports-backdrop-filter:backdrop-blur-sm"
        role="alertdialog"
        aria-modal="true"
        aria-busy="true"
        [attr.aria-label]="loading.message()"
      >
        <div class="flex flex-col items-center gap-4">
          <hlm-spinner
            class="text-4xl text-primary"
            aria-hidden="true"
          />
          <p class="text-sm text-muted-foreground">{{ loading.message() }}</p>
        </div>
      </div>
    }
  `,
})
export class GlobalLoading implements OnDestroy {
  protected readonly loading = inject(Loading);
  private previousBodyOverflow = '';

  constructor() {
    effect(() => {
      const isVisible = this.loading.visible();

      if (isVisible) {
        this.previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return;
      }

      document.body.style.overflow = this.previousBodyOverflow;
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = this.previousBodyOverflow;
  }
}

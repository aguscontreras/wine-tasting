import { computed, Service, signal } from '@angular/core';

@Service()
export class Loading {
  private readonly requestCount = signal(0);

  readonly visible = computed(() => this.requestCount() > 0);
  readonly message = signal('Cargando');

  show(message = 'Cargando'): void {
    this.message.set(message);
    this.requestCount.update((count) => count + 1);
  }

  hide(): void {
    this.requestCount.update((count) => Math.max(0, count - 1));
  }
}

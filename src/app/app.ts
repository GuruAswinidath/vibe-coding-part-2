import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {animate} from 'motion';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  display = signal('0');
  previousValue = signal<number | null>(null);
  operator = signal<string | null>(null);
  newNumber = signal(true);

  history = signal<string[]>([]);

  onNumber(num: string) {
    if (this.newNumber()) {
      this.display.set(num);
      this.newNumber.set(false);
    } else {
      if (this.display() === '0') {
        this.display.set(num);
      } else {
        this.display.set(this.display() + num);
      }
    }
  }

  onDecimal() {
    if (this.newNumber()) {
      this.display.set('0.');
      this.newNumber.set(false);
    } else if (!this.display().includes('.')) {
      this.display.set(this.display() + '.');
    }
  }

  onOperator(op: string) {
    const current = parseFloat(this.display());
    
    if (this.previousValue() === null) {
      this.previousValue.set(current);
    } else if (this.operator()) {
      const result = this.calculate(this.previousValue()!, current, this.operator()!);
      this.display.set(result.toString());
      this.previousValue.set(result);
    }
    
    this.operator.set(op);
    this.newNumber.set(true);
  }

  onEqual() {
    const current = parseFloat(this.display());
    const prev = this.previousValue();
    const op = this.operator();

    if (prev !== null && op) {
      const result = this.calculate(prev, current, op);
      const expression = `${prev} ${op} ${current} = ${result}`;
      this.history.update(h => [expression, ...h].slice(0, 5));
      
      this.display.set(result.toString());
      this.previousValue.set(null);
      this.operator.set(null);
      this.newNumber.set(true);
    }
  }

  onClear() {
    this.display.set('0');
    this.previousValue.set(null);
    this.operator.set(null);
    this.newNumber.set(true);
  }

  onDelete() {
    if (this.display().length > 1) {
      this.display.set(this.display().slice(0, -1));
    } else {
      this.display.set('0');
    }
  }

  onPercentage() {
    const current = parseFloat(this.display());
    this.display.set((current / 100).toString());
  }

  onToggleSign() {
    const current = parseFloat(this.display());
    this.display.set((current * -1).toString());
  }

  private calculate(a: number, b: number, op: string): number {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 0 : a / b;
      default: return b;
    }
  }

  animateButton(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    animate(target, { scale: [1, 0.95, 1] }, { duration: 0.1 });
  }
}

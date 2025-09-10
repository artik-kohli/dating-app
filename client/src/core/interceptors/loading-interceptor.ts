import { HttpInterceptorFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if (req.method === 'GET') {
    const cacheRespone = cache.get(req.url);
    if (cacheRespone) {
      return of(cacheRespone);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
      console.log(response);
      if (response instanceof HttpResponse && response.body != null && response.body !== '') {
        console.log("Cached the response.")
        cache.set(req.url, response);
      } else {
        console.log("caching skipped because of empty body")
      }
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};

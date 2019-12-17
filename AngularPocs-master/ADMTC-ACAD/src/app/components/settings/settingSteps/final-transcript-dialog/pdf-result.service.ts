import { map } from 'rxjs/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoginService } from 'app/services/login.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../../app-settings';
import { TranslateService } from 'ng2-translate';
import { PDFService } from '../../../../services';
import { Print } from '../../../../shared/global-urls';
import * as moment from 'moment';

@Injectable()
export class PDFResultService {

  private academictUrl = AppSettings.urls.academic;
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  private student: any;
  private juryDescision = '';
  private htmlNTitle: any = null;
  private hasJuryDecidedFlag = false;

  private stamp = 'data:image/png;base64,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';
  private signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAuCAIAAABRQysJAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAuxSURBVHja5Jp5cFVXGcC/c87d3r7nJRBCICGhaSGQ0CZAoS3QQCNttVKkVaxjsVqdOqP4h9XpPy6jjs6oLTraorVaFbo3rVCKhVKWsm8hAUoWSFiyvffue3nL3c45/pGAtEBM4CWE+v3xZu68e7773d/5lnO+cxHnHAYSDtTc23hOoybBYJoUAGHCEUIKFmUBiQIhguD3On0eB8L4kuEMAMOnRYSB/z7b0/vPTQdsplk4Ns/lkk0DmSYjItc1zTRYb7JXABAQ0jnnIgm4nRIRJQIOmyiIgigqbq/ssdvcTgeg/wNYDU2xgNf/lZopA99mWJaaTGlpPaNbzDItg6qqoVG9O8qYZegZOZFQMaL+HI8vFPA55aDX6XIqcKMhRAOHYW8i8/q2o7WzJwc99qt7AONmLKa1t3cl4nGNowxwbhoCCByQQQ2PW7bJkt3myA8GQiH3jQ0LAOqPn968v2n54iqfy9afxQbrEX2aL3OzZVlRNXmuJ5FJpxLpTFubmtZ0j9se8DvdbltuIJCb63Xb5I+rQjcALABoau3atOujORWTbioJD5Pdmpk+297bFUtE47FMmqdMU0/1Sg7HTcVjJxXk+jyOG8Oz+uRcZ2zbjuM5Qfcdc8oAADgHNIxTraW1+qNtx890E841DRHCCEETJ4Yrb5koEXKx5zJAeLTB6ss/6zceTFFUM6vM7ZaHwZjLh61h0NaTZw8ea+9R47LkctiQ1+0ompBTUjhmlHrWxSnswMGT5WX55VMK/2duyrpEI4mmtq6Wc5Gunni8Vy8qCN1cECgrKxJFfN6U/iyBRgMsAOiJxt/f1WRz2e6qKrGLwvVKwPUfnWpq6dCSNKXrUUMrHT+mZu4tNoGMIs+6ILsPNp041VOanzujsvD61qxuVX1n65Fjrd1+m+L3O0rzA7Oqbh5MUR4ZWP1QIt3xLduPJSksurMsJ+AaeVgcAICh8zuqzm710NG2E6c6WzsiNxXn3TFjcvG48KjwrAuy90jr4cOnxwQ9i2qmjpLVY2Nz6+6GdlXVkhF17qxpc6tKRgksDoBSqczGLUd1QFVTCwrzA9cxJD+xca97d9dHzd0Cgdywd+H86T6nAwAYUAQYDd28LHjWRRn3zIGjHWPDnvnVE0dVs6Gxqf2DD483nGqbVlqweEFF2Oe/bmF4sR9x4Bu2HjvTGbln9uQxeUEACkCuVlmW5VyH+tbm3Q3NPd6w7ztL7/R6bAAMAA3+Ydn0rAtyqL7l/Ya2myfmLbit9Oo0nDgbtUvK2KA967Z1R+LPrt2cyKTLi/Mfvn/ukCZnOGAxAJzQrLp1hySX8MC8MoGIQ1Xx6xc/UJyOxz9bmfXq2UelU1X/9PfNPT3pbzwyv6Qwd5DDhyOzIABwK8KXHqh0KtLfXt8djyeHqgIzTVWjw2IZAADEVH7LtFs/UzP1R3946+1tDQAAQK8bLAAGQGvn3FQ1pfildbuOtbYPSUXQ50z2JoZvcbbxw2P/qNsyf+aUX373wXXr96zfWn8+t/JLVrPDC+uCZgIAZaXhe++u2Lq9acfek4MfPHNakSAJfFhIUQBoONk+Js8JAHk53lVPLXvr/X37j7VdstD/ZCITRqBy5wZ9y5fMffHVHVG1d/GCKYMZYrfbGaexZK/f6cq2OQIAdHXFFy66HQA0yiVF+WzNtDUbduT5vYZpMgocgDGGMSECEkUiCZhg5nI5RwIWACgKefTh6rVv7/9r3f6H75suAAI+UCfKbZNjiVRnNOl3ZncXhaJx7Y1NOzsiyZPNJ19aF9MYBoxzPYqVZs+/vbNkbICbAsHY5gDGKQByuhQ9aQjYnFFZMkKwAAAhcdm9VWs37P973e5H7psBiAwAwW6XMCGmxbLaKQMOsHZna937x5KGPq+6uHxc0KZgl8sDAAePND30mYpx4eCVVdCRXmd/YWFFUTj49NodmmX1L2OvYBvGMmcsSw0DdP4X3VFRcE9VieJyzauYlBPyuVyeeCL5/Z//zefxDkAKABAQAUZcbq8q0sBc9dKuxx6c4Rav2HElSLZMlr31fH9HsCzkeKY1VjhuDDDrzS0H9tS3GJY+pXjc8iV3DSrbjbwsqJpsl1pXv7z90fuqPU47A44/CQQJokgIGYpfXb5vtffIuX9tbywb7+6Mql2dCWrS051nFVto1QtvR1P62JBvae3swOAORK4PLACYNX0CzZjPvLB15dfn2gTbJf7DOWXC0Nqe/eM10zQMK6YmIrFEMmmtebd+X2sX6/XG1JTL4zPAaD2jfu+rc2qrJ+UEhnZSed1gAbA5s0pEG/nViztXPny7XRI/jgvpNOV0XiZILc6SKV3TjIymW5oVS2gd0bRlWZqWodRy2SVAiknTkp0gEymitLR26gqnze8QA36Py+E4cTa6rWntkpppTnHIO/zrCAsDQPX0Io6U5+sOfGvJbag/lriu03hSS2vmnv0tp71nYmldFGSMOWc8Y1BRIogB51jESOI0ZVCTMqfT5vcSRRELwgG30y5KgixfPhtu/PBo+eTwVZC6CFb/tNKLWhbD2LpjwDNp3dD1ZMacOsG9c3/jT1a/WzurjFGdMcuwGLMIN7jBGMIo163khEKCIkuyYBcEh1O5lkfHU8mK0tAV0x7n6MrnocLH451cLm1alCLLoCZnFgKwACGUYSyVTnNqUoqpxVOa3qtpAsfMYrphIgSmZZqM6QYXMdENM5kyEolk2qKxNDPTmixiSWamxQFB2CPmeBz/eq9ejakLqm/u1Q2XIgsSozIN53oK8oJqxlQty5aicdUCjE2DERELImIUCEaYEMo4wVggCAAAc4SAYIEzblqUWpxzDoghwMBBVsTWM91+d8nxli6TUwEjQMzpcOSHPACUM8LRQG4iAEAknopGIsmM1Z1E0Vg8kkq7nE4HMzC1IhTHMoaV0sxkWucsZRjMgoxOdYwExBRJZpxhjO2ygMAKerw2IiPMOaYiIXZBNC3qckgCRm6n5HYFMeYcuCKKdkm02SUkSAgo55ZIyE9LCp979b3tBxrunTezpzumGTSVslpaOyCVjqYJIkhAJrMMTESEAIMIQCillFmSJOqGBZwTjBhnnJuEgGEwhACBCEgAoAghYJYoi03dvXsbTt5WMunw0Q6D66KMPG5H86kTr6zb6woFf/PdxRPyAgOF4YeHT/7q+X9r3DLSGU6pxQXdEkvy/ZMKXLIkiFhwirLklm25DoIEESPFBqJIvF5XrtvjsNmJiCRZtMnitcdm6cTw0395p7JsLMHjAOCDprb7Fs7IdWbzK4dVr2y3K+4Vn6+6EDZr3trT3t5RWRa8e86tef+rOAplEwK/WLmYyDbCDJ9NxKLEEAhWmhI7RUhBSJblkTl68Lrd82eVP/aD363+2RMIAYhyV4+aRVi96czuI+eqphf1Xb62ad+auj3lkwtWPHhnUcGgTswEj8vlcV26s7ePYHP8vzJ7RmljS/Of1q5fseweqrGMwbKo/KXNhzvVyNJFszOW/uRvX0sntCcfWzS9rHDwrza0pcMIONjXltZ++8erDjU3F+eHUhkzW2ozGe14+7nHl8zcse/U+s31Y0KeH658aKivNtq+juUAsKR27uo1G7BhSCRrOl/bfOC2W8ZXlxfVbdy5vObWH66oHWQreTTDQgAwt3LqpDF5v3zuRadDyY5WarVFUroKX175whc/N7O6svjCbv2GhtUv99fMiKXMzq6erEzAlv2NL7+3L9qbrK0uVuSrrxijFNb4sePmlU88dLQlK9r++MqWjh71m8tmzq8uPX0m9qmC1VcC755d2Xw2du3a1u08vGHHqW2/X0mQcPxsp9/luLh3esPD6rPp9pnTO2M0pV9rQfzFCx88sXzexIIgAISCXkpIWst8emD1SVF+cNndFbphXIuSxtbOgtzQU48t7LssCHve3LTlz29svboXF0YtLFnAy2oqrlFJns/x7JMPkPNVL+xxJyMRn99zlZViOD4MGb3CofHEqfzxYfdV7eH+MwCw1E0SsBUI3AAAAABJRU5ErkJggg==';
  private c3instiLogo = `data:image/jpeg;base64,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`.trim();
  private retakeStamp = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAC1CAMAAAAtOkCzAAAC/VBMVEUAAAALFSYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuUY4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuUY8uUY8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvVZAAAAAAAAAAAAAvUY4AAAAtUo4AAAAAAAAAAAAAAAAAAAAAAAAuUpAAAAAAAAAAAAAAAAAAAAAAAAAvUo8AAAAvUo8AAAAAAAAAAAAAAAAuUY4uUY8AAAAAAAAAAAAtUo4AAAAuUY8AAAAAAAAAAAAuUo8AAAAAAAAAAAAAAAAwU5AAAAAAAAAxUI8wUpAAAAAvUo4uUY8AAAAAAAAAAAAvUI4uUIwvUY8vUZAuUo4AAAAvUo8uUI8uU44AAAAAAAAtUIsAAAAtUI8vUY8AAAAvVJAuUo4AAAAuUo8uUI0AAAAAAAAuUI8wUI8sUY4vUI4xVJIuUI8xUY4qTowvUo8uUo8uT44AAAAqTo4vUo8uT44uUY8AAAAwUIwAAAAuUo0vUo8oUYYuUo6vr68vUY8tU44qVYwoR53u7ew0TpHp6ekwVZIXNm8hQ4Tc3Nza2tkAAADh4+ctUYwzVpk0XKI1VZbx8O7o5+cyWJkoWI3ExMQzWJvT09Pz8/M4X6MVWYTAwMCUlJSVlZOlo6BkZGR+enRBSYoiXos3YKg6XHw1XaXJycm1tLPHx8e8vLsXJMoOeIO3t7c0W6AlZ4GKioqrq6u5ubnHx8c1XqOYmZu5ubg2X6XIyMegoKDLy8vi4uI5Yqzj4+MoQ3Z5eXmhoaH///+AgIBBUJoXZYeRkZGPl6RycnJNTU39/f1MTExqamrU1NR5fIF2dnYAAACTk5Oenp6ZmZlbW1uIiIiVlZWurq6NjY2FhYW7u7t9fX2AgICkpKSKiop1dXW0tLRgYGBWVlapqal4eHhRUE+QkJBnZ2fKysrZ2dnDw8Nubm5JSUjQ0NA/P0AuLi7i4uLGxsZycnJra2s4ODglJSUSEhLs7OwDAwMwaEJOAAAA1nRSTlMAAgQLCQcOIhH7Hu/PgVb3F/MU04Zd54eDdkR7JlHXRxqABuvhs4UyINugg6aSPTOZbiuPykFxTUTevnK3mJQ1/Yh8Sgzkr5aNxLujOFPGnWpgLn9uYihZPwlXHWVrSSmdaTomZ7avqYp3ZE0aq4x5UDcQWr0tIsSjdF8Sp5CgwFthFHowqr4WsoN4Ip0Uk4eAVUo/DqeajoEyB6iNeXNqWVkV+e3KtOXTu6upp6CdlIZza0I6JhD45+PXwnBQQR7j4s22q6mlk46HdXVZKvXpzc3AuZo9OLGzpAAAI/ZJREFUeNrMmftPWmcYx59z4CA3RUS5iHijojIv1SIiIiLIpOLdar1W521eW11bde3srJmxaZZmydJlyZIl+3nZv/P9e+Z7DmQcQeoFu35MfAEJvs/73L7PC90B1Qu+mbn378fzXdZ8xu+/i4vVlT/+/v3cjG+hmr546nZHnlktrvDGyLGveXm7l1Lo3V5u9h2PbIRdFuuzkd06+kKZnhoJWyzhkcG91/QJXu8NSu+dmqYvjL0Ra8zl3d2na7C/63XFrCN79KUwvRWOWbxPvqMb8N0TryUW3voCHFO9az1yjc7SLZgddR1Zd//fAjD1ywfLYC/dmt5By4dfpuh/4mQkGBs9ydmnjcaCIyf0+Wm2dI0v0DUoK1VTdhbGuyzN9HnxBbuO0zJU3dbiHjIF5nnKxBC+IonJAf6yunHcFfTR52Om60P6v8vTI8GQgjJQjgckYUJnliP60DVDn4etN0eZAqANiNY8benUA32UQNXd1soRg9c6YUs4zgh71qA9erNFd49vMZg5jot06GGrohzmMmJEhnBORykR1QIhRP1+GxWOFQBNn8i/4OJdB9jC4uKlnXgINeLpdwIOtvYBRo9eA7QRjRkgUk5fIQQE7I6i7EphcXGB7o7e/NNduhQ3ygvZWpIwZCg0P6bmK4yIs2cOoLjAXkIFJiMYVayQVWYJ4NP8Xrojnq95s/XfFhgG2LoDUxnPsl/LK3miBzAx+5aACBGvIPoWHlvcNEEkGKCiitrLNIN37TndBXU/d8mVyNiF8ywF2olUbmBCwRFx5z+MTUQnWcIgVEoiHgwTcWoVNSFqiwL9qsu0S9fPd6D1594NkowH6CMZlQbUPNWDBVZya0u2vmE9nLViwBmXiKHSoYpE7DBoQjoYuukyBt/NUW7ZPgxeVLd9MBZSqS2lZ+gh4S8jkYgZIsYBMfDMtZIjgQkS6QdM7Vp7YyU5fvS7N9WZ1HHwcJtyyO6L9CZVaEQ8ADxOzXZdT4njPlAveuQxMDTvGLMh1CYef4dkXwEMpVziA/rzBJ54UjtxTuirjM33xS7lCm794yylG9LBDjvexFGSTjjZXueBBslBAbWU5RVE9BT6SvGtNtyTmqQDiPDiI0XJq8ct/cDXGTPl4zqXoyx/t0HpvMU57jxBIVCSCFDC1mFxLdSgk+V7RKrG9/FQJW6oAQ+LeBJNq5/kiSFt9BughTKx8S4nOf/kxRPKgAPxerhJoP/QGiRdqI7CXEh8B2qIqNUpmdfIXmMMIc5z0oMdheysPYhn2cJt8a6mHQfrDsSrqQoaeRPQJ4LjMeAmKgYCLXE4nWiR2qTfvjPG3rQjiUwkJZey4m1FkSgrh4lh20wLilUv3ZLY4sUe2K43RO1JD/RQKg0wScrja2CFdb5zoktxlCReA0pZSdBUlbQzy0IRMbK6daJkHqgA5pmHmmBUpXXHxRjdhulTK12gB4yaRJnqKKQUbDB2S6dtiq4QUUVVz0qeUFmmVTAXvh1umNcKNGkE4GeZpM9jhqjM0LnvdwAG1Lcqiegh/BO2TS3JsZ5O36J7rKb1owg0fTYPUMye/MpaQgoVLB1ElAqVgkQEnojnSIJnSZH34EfPBFE94kpOynEmVwbiQCML2k1I9JCcudXtG5erg0GSUVq/FMcKR1w/0E3i4fXLlHzcnRz+uGwlk+cVAhWbN3nJxfoi5ohX0EQEyUGB4s4A0EdyBg/qbijZDy7WikbUw8+OulInpfUmwKK9jCQ4IoVAV4MjoVB02kpiPPEgUCQw5YNXAomlouJi8TpYuJkdU2k90AnYOEnpooB1siiiLTuw0Y1IzI566GwDmx6ghRcnMLeCOUgtzmlypm5iyXKaHdL+55OVVq+UiiqgeUW3odAvChR0jCmZ/jIvKcUsM6OP0i1Zvn5++Cgdtn+FVIQh+WGivNy9pFbQZVSfzdYtL9fNnlVn8UzkaWOJB31KnnUgu1IgSdnYKQ3fdfNk+0A2/+fZi2tT9s+ogXNSPLkiQalM3/++b/QR+4bEZbVa8/PPf7nYtyOPRn37l1jUo2sXmBowNvHEGIaxlCdSrUR42eB4cK3aVb0qU7tPpdlUamu6vKQadydDXc7Cc2++xTXunRucell3Mi3+mZs+qXs5NTjnHXdZ8r3PM4W6qlCgKgBviVEL7KgFVl9gXJGp4dVqujqnMkXgh0bvTFjSCtxPlrAWZYYL6fC65dno1BldytnU6DPLejj94pujshBMUq/l9DBElKzNs1HNr0zVTKd0ZYIyPRBHvUM9OQQ8TninKXGCChXJeOldj4Vn6q6UgjPh2Lr3Jcn5FtE2E0sNrR4oTlbySBQ/8qmqKUhXZONQLnOd3YKS1GZJIqrM6M/U82YfHcW8zXQNmr1HR49S/dLO2vkEYAoYgIZKgRJo2XCcwuEGXYkteRT60cILrEElJr9vgM50oR0LbvxE1+anjWDsCSVQ1qN8UqCVEM5p1PJU4imP1yaav1qWwVtX8voLucd3nHkKVqT6q0IISFe3mySjd64rtsXRjeC2Yl1zvcm5bF7gWYkc7ilVKakYjAaBBbe+UhbDL64Sv2vHJJKcDFRlaqIdBLRUJSm5sjGVKtUM7xvrAt2CBesbr2iK/b5WQRK8QAOA/u18Oe4JS0xOyg7qeI0+yfpRqtQ1q8VcWMHDQgUVGaQmxfEpbn50GD6jW3IW/vgnC2delbLdYugGxMsasxn1tQqScbROn2A31damhFyncjh4ngbQgR2SMfMx/4RywEn+H3+RHDs8Cl4SphoHeyRj7RNp8nq1WS53dWVMnmvQLt4fTLS3qlJz9TC4Tzli/7d/5NWiNTHsuIFOJiN5h72doyTNq68pG4vfUyqVRjQyl9dDryUbyrXE8/9F1fiaj3KI7+/fZeWyExhurx0GGtnk0G0GcG+Mkny/SFl4/kOaf0O10mcaddAUpKbc3rsNyjEba3uyGycDGF9XKkTJYgyYEOqmJD9kueL+bvVirxU6MJxUW/cc7GSSPGNBmGuaV//l1Vx+mojCKH7aGUpnwIFaaKUoLVI1pYCkjzRIAQ0iQQER34+FIgoa3yFEDSBGNyYmrtSFxr2vjUb/Cffn7zGdO52Z2ymoifS3Iay4X+583z3nfNyVBL6R1dh4RjU1XrKgoIUpvz2Drz3ARqyehIWyZ2EnLA84Z/Z9+816xanj1krUhy3AF125JSf8DX0qmnsbyVafChxwRV8nVzf8SJ2J1U+ymBcOdAFOjGBxbmkKW8TUkmTo2lrVkg8lG2bF9GELymzYoq+dCdh3RCMZvlmHPBnzrBiWrmLLuLp0CTIGx/b1sE0IPY2dds0rqMqlr243PZuNkGxIY5xFyOxYOYwt5PCKO0zT+4sdbMQIOe+fbWSuzfVxXb5U9fN8V9G9wfkcybGjrNBWQ8PYYoaHHG8qJlc7TtNkUM3UB+3ZcN0HL3ffAsEAJGLHmsgK83x5G7acbZddO5f2vkGygPgAOXA6qIi4T7B4t8qFfl6GkmSxs5CQ3XqS3boCm7VnqAHP1iDYw6yZ3mhnoORHdVWRlXqVj/zGW6CHJbRc/82M3xnmo3rAX8M65ErauSCm1bQfVvaqz+koE/U8yuc/XwWesGEhRZPIkbZ4EALXXQ4tokYsij5JaMwL2XpFnGUwRbJxEoIf785D5sMr0Vm9SqytXEzTRO9THW6iL1EzXkYhEtWu+tLDJm4m31U6l+aE568+QOaNKT0Nsf1qjhlHKcjCxcwn1JBPM2UFvgv5EHv8ZtLJpLEvkybnLAH+BhLrw/b2I2+twcZb+3MMxetg8/3jT9SQnx+/W3twHjxI7WwdCmQ4aWbbbfbjNixrx6F7dtQQ0QGkS7odSn5yu+J4laX9qCn7l4TnMAbI5OMgEObAzhiTKqCGOGk5wSG4uG//1hzhBDBCGnW+Clf75Rv+iC+o4P/x7QtMlHyhpFj7SMOPLFvM5j9bvoP77mF3yqU3eQfTHA+okPn1F43un+AgNuUx+/+l4X/BNTkNhnUVahdHMEkWIDjlehB2ry1Li8ADTGUUyDy/VvH2KO3ZlkOH0k+bpQVjZA6bkmVH8B9kl2SQ5phMmBOpWJ/itO63PPKa4yunolKQRR40PG5/Zd2zaLfoRZkRMo7NOcSO7aUUIJ6Al2CsHjLrksBN0RAHbCJbbbcanXIsipS9KymG9qGCGY9FbiVvZ8d7ImSPsz0ZxB9oYThoTqI98NLJnCdEmJH2TB114rnTrjhu9cJJ2+GuyonECJnzV5jg6564xKA5OALTtmHxF/rwl4Uc5wS8pJlSILN83W1oJ6zVZW404Jqmqw/KJS1CZp7shsSiV/IaVgExlq2Ory7hqOdAJiFn3eKnVUg3J3ywSGSa7SpT2z1C2H04PcJwxsyJVffhyh/UixOooJ9MS66tyrbesBpiJ3nHvI/OEMliRvzFIq0NzayWEhU94S5RSADH2URtLBLKA2e6G0imDLN9QtQiY5pR8T8Lbjdan6yykDvxwppZ7y+ikpwcKQ4/woaFGDT1nBomB8IaGROLgKZw0lzGj1oXFwgxLQpRcJSCK8iT7Epq5HwpqhZUnPSR5OP0uB7wbJfei7l1bi88TE7HFdeFPNxdtZDfhJvdThpBFICPC7JYcYvKIuVnCVUwBaH82kJqq6FYoZUmCqwaY2Ni0mhs8ecG60XTxBtew4c6z1PmDNuW7mTnu2UJ++3smXNm5rDHnvgyGir1oQQ1D6hNes1LuPhOUeL5TwDxsYhr2RLxgjfawnIuHlbhB5ZyflfUx04sPOo3rNYrYXUyPp8PxkNivb8K/E/qgE9IHRDAo4mz3wehSHNtrY0YjPMzP43GnhbGNQzQj7qnmEhlUoQHew0Ybr/Vg1ahDw032Ojvg4QOn9pCJ+DMzeBSLEIkyTiCbatYy7MYC/aAsInYg53rU5QIs+Xl4AacOQlR9ty5B2eOQyAWKXUjL3AmPD7+S6fTH9MfGrjNO8jzRWcRBTjFi0gh+0dkAeyEjsGZ+533LETmQIL4nxAaxbLLhyseWltb0B5rbgURm6pcpNJAgkQCYpHXb0HC3AGbvDqyanoDCHEeySFGSKRd10xT00ytR6trvY043/sr4haK1BGNRMFMOIrAxktZkLAEcn4ku2rdSQRaFKFZe6qOzbDBCY8vmw5Oivyc4l9uL/BcpFkfCliXPeujczZ3yXSXrh1FdEST2hj37Gm1RR0S+viyjK1EmW7QcFpzXgYNFwi4XpK9NCmAx+GhZC82BY4i7gYm6ZbaLio4dA94AyTlY+XkVBV90wBdnBDJ4NMoKAAGLVk9i1zklIWdooCNlGSv+XD4CA9DcOb2DoToVs1eQszRkMx+jgRq7F78iMlniSpuxqikxWq2jIZBueU7D4MwopGfNyGC+KabncFNNPlpWzU/WwAbd7fgzPABrvqyrbJdEBKzqt5V/qxfBZHYVqm7gGotBSgeRvjUr/+OCGRxRJe9YyNmzTKNCPNCURvbrmxbsH8ln7RSX0CIW9OfAJErUF+5K5bYSvxapRKidxoInKnAk14ls6V7oXjGFjn+i9/MnDFr20AUx1+mTN4CFYVCk8EECi2dmq0Q8g0ydDD0E4Ru6ZKpHdTBmMQmiw3BgTruVqdQsDsU8i3uLifd5U46Y13sxnJs7KZLdRKCNh4EmfRb7w3vf+/93zsQ6FVig8fP1p6Ytf58/d3LVXj9YTV5Gq2vvXm6svwpvpg5tjKrtplltPSJns3Kgw/h0WZm/2+/hZTyea+2vP63IQfEWabUbft4OcvdFxBTadp0RHoV+B/TejnAbLz0ti+Exvb9+bsLVly0mo20ktwTZ4nmn/8OjBwQtU5620pzhMMTMFS/pwawoPgJAE60EtRnDNPfHaP6h2iX06JuQQ7YShrcXihJme8QrasAcEpkpwGGj0WwjMvaKpIxRA6jctGEcm8hF6KddFlhH3LAfiEuSFeYPB3EqOqW4ZQpEXa/xaPCAhPRaEUBiGDMfF+1qmdKCKlDeR5P3xLkgFIxNoDklCHiEerT0K5qLYRUYcsUpxALqXMT4I1dNqRU8umIcio1W0RiD6wdyAE71kHsAOoPiTvHjFHOwrtIFxfC1/VUSFNzzkhwNb9C0RGaThyH+NiZfqnAnpWLn5hsWHvGIorSIXbHY9enlMnZiBCHeXLWBjiKhXwNOSLYnd/8wpz77G7gBa5LBoNpB0pHkAus9wDHLUUR8fq3N5+R5ET/0VGarpxcT2pwaIQ0LjjGhAT9fuA5cshnYTC+DdTl5fWgvHEIueAvM1cS2lQURW9iJTYWk0YrDqkxpF/R2hJNRZoKWoINtQWhoq5cWIWuVFzqRtx0U4pYurEgDnVaOYAbRRFFHMB5eBmatD+mzUCmNmlSa1V8w//5+kw1cSFeaGl5Idzz/xvPOfct2Q/QN+zCebr9IX8wOPzRnciO+pNTnoQ3PHkJDtM3clsMuuI+n9vtc7mH46PZ6eig6BoLe72Tl/v/ozdySwy58dSKJyWc64jnU3bEjzvZtBc/8bvnKZDeO1Gfy+Xy+fCPx3UxMhwNDgUS5ANXXxz9j8ZIn+gmeeKfuCfuDkTcUc/IWJjk+Z4BgYHuoAc3Exz+4M03iWg4gdvDsXQPnPxPZi1KCd3yuz3skbv93Xeznrg3QXBMXoWjDAhcE0NB0rHEVPI29GUjExHcno6dxtPBz+uISrPbaDQaoPhQYxfsb9vNTm2R6wgMPBAJFF90KjV+DZ7MJMIRhgNOspX93Ph4ZjwkjouuxOcrA3AKw4xgHPd+XdnXIxqN5rlQZJioFDR7OHB7kSs7PBKTGRHnGfrozT4BuB4hQNJX+kG1ClZdAOgZHPRHc0lP5Av69jncDXD/UjgWiz0vsNeqQ1srdRSKHoqL9j8kWo+Qrci91jlxPCjmxKHJL+hLeuwMQN9IJJK+ch/gwio6HTwURV8gOJqd+RyeGIvTDfCNcOxsod2vDW3bojES76cARUZnlUb9V+387vd0RvQPjUSnZ2bSiYmA6xkA9HenX/aw3e/OIwBPv2bE4DAeQMFAODz9AUjcOyOfR3ggBklorId/Fuw80vs6NxXyxD3ukGcsnLjKWm6eYucRdvY6l0tmMqHk19DQROzxb0+INmYogE20bKxj3TJwbLZXUw63uUVYu6uMMEK2RQaJMuraCNDUTHuh3rzd7pTAzznQJhysZTy3irWb2jRwwC5soef5HXahVlvghPg0lcwkQ6lUMJCIPeeyZF2n54E/mUtlQsPTsfv8mb0gkHpafNGE6qqI97GMsHE05uNUNZRWYSV4i2CejjrwHKydcj0mnVL8ScrFd1F9pcmMqORXZmetB7gzOxsl/lQulYx+9L7lu57cdd75p3LJ0U+RZ4VZFB7IPkqpLUWWct264y1zCK2zudbsnE+INxBQhZpRX1tNBMh6ymFvX2Bav3Utu9NmzaHa2gaMlxmZ9lIgFrTNurCOaHQWs6NaYJYAnkU5PejP5EKB6fQtruspvNbZO1MpMfKq//e8lg2XQRCucw1q1BAgSIfxzINl0tTTXo66KHcnaQ3HaY3DXtIV568knKKmDACzdbRXbUblGyiQfRQIqmnHX0VKXU3MO9daiNfqvXYnmXJPPuZ5rR+Zxt5Tj0J3/8A02pBlmda4YAXj0ZbK1T1t0uUu0Iyr4sjjt8mXBOWBoNXKfHuMKSP0S/QykK0OYLx2M0gVzVsKEwc9Zx56XvBMI8f99g/8gfu1ISlq5xAgzFSh1NSDiV6MsIMy9FW0KlyPgVDHrqVKdvexu4UYOawA2a6SdBRnR3t9vXEPJsdn5X77f+F+S2XjbVhBtiyuWGtSAwFC10X61M1KsQR9/ibiZxfUMhBYVk5cxEQTcubFAwHZFSCSA8uIlKgqno0vTR9hY6RDLynEyhtZqZNF5d0YCKXg68BAR7EMBLTOSkS9IVa5TBYE8haUNyI/idZ1LTgOtlg3FK+PFKtY8QsiBwRLC4fyLqlqdsMGVKPFG2QgNAzLdWQ6a0Y10lc08F2LfXxXXolWFa1Ylawh2mjqPBCwo+NAw8yy70Soow6nKQNRGPxO2IN/yb1oOQeEDpy6v9AQS1N1ZwfSJMns2krUJqUj1KAqBYjWAGwF2QiGSiRIU51lC8BKDsgipGNdSqUuQdUtTWefHUhZIyo3bzCewHNTO8hKxxqtAuQg2qeZ17kCNeiJXIXsGzWdAiuh4IHoLWjxCY2244RFKF5n55wPfPDOB1ZNp/kJCEmWOTloLN6UH/TIChKQJgKMRiVtXitb1sikoS0n7dCVV947K6VmoRTnA+9F4YP3ojgWWg1KQ31F/r955tbGxtbm3XmMFZvZDlHtbHCQ/aPQaFlobVexsdKyomZhVzXNfK61wUS2M2vyZzW9ubVmW0UXvomE86JwwXlReHcQH7w7SF2m/K0i/ykOU4OUyk9WdJV0tQ3M+U7M2ay0EUZh+MycmUQTazT+FOuMNjipTBtaNEqpBkwJmCa0CQhVChVctVRIsy3FRTaCe5e9jt6EF/BeT/1mQo85oWTVfM9CDIGQhJAMM8/zLrDcx8WMXOHx3bQGffhQrOwgjbaDxNfSaF/LAuJrKbSvJQbdJB4/IjuIQafRBp04jRrtNFpBnEaNdhrFMtVoy9QCyjJVKMtUe7+aoSR+PSALDK5H8qLX730SxPtVJvY4ufBtC1+HIebUTzmKiS1DMKtrLgliYosbr3G3z7sxICrCnYUP18Wd/F9cxWwewJzImeLGq1pBsqpSOw/DVrUMdKVWmBJSKwhltPd3j2qIAhKkVtD9CJ1eNueQEPfW591sHkvbbLUfSdlHbH7pW/go2r70I6roMbST8A1Yvs2aGn4DhQa71ooeoYp1x6FDVDJM4VIgBx2DscYqJUTUWzsqo0nm6VeSvN9eYyX0zDFyFovm4/FCDCJprKR6G5INvPs/dYTpWZLuDFus3oQqKkQ1HPo+0R5W6F/V26dfv0dUnx0zwLFpTFEmg6UOUdgEXm7iYIHJjGgEnnSIim/qR/EAJd7C1m26CWmlDBUO45zZwarng3Spctl3pQwdi69HlahtFGLg0iM6nn8oU/2YWqsrNIAGzbwBVn8yeWUsnbK0umP01aTjOYBqhmkF+cBSPS1hTvkpUbEFIOosovB3JuVdn8ZxvrzSNUzN7F9sIDqx0LMLT+oACg3z3ibadhQyj/Tsms8XagY+OmIn2Xz13OkuDDxTl+ZqlXzqc2fOvjd3ssxqYUBzZQ4jJazEmecS36905djm5kOMdabdCAeuHtH4cDV5hYP2gBJ7ydmPFd+hFAsrHBSizRnz7VvQprde4dC7KCkxeguczPMfFz0SprSLIpixCocoh4IkhbKLMnmpZr5zwsnljtnQN7cbGypN7d/8j6Wam/648L0YJK+nzBQ875TUUs2k7SDH+dPclfUmEUXhO3eYYRlcgCKlstWCWEqVIorWKriUVlsrbrjEJS6xKu6JS3A38cUHY2JcEo2Jz8ZHn0x8Mf6F83s8994ZZwDRoqD9YtKW1Omcufece+aec7+Pqgpn9E3hF+XEejArYd3nDrJCHYfB53QDQFSwV++QTO6gubM5TcBAjMQueQAgMlJQCUP32JzO7F1WP89CMVE/LnJKAYyfpQRA0GBzaoNfqwIQLFxkUTxRQ6+DWeZv3eLX2nSrYa6G4wAp9M/nboCZClvXggpJQ4LOhV+LVM3IxWky8SIwvnqNSskBjR8w7hbj2YvGnZxdgBA1oQNYVD3KyF1Ush8SNh6xrrTBQSeuNbOhQkXorvQ4dfbujnPQ3dq3rEkoQOvPp8AgIiwC9KtoVAq4u7862x4r4Bikw15qLuwndUJ1Us8KuPzvWAGXIytg8zEbz1YJkxIxCVYuAqyg2vAbGEjil/dn2uRpVCuywpZDZeHSvCK6nMbtBNFpnsYmrIcT1MYPAvHqiev5ILCTvU7MlxRy/fOKtpkz+f15I8zhz3P+/kUrf/p/OsCcaYUDBlnCOgw+t958MAW5wmknz8fp12rbXKYCo1AcHSvCKCcutktk2lxkLVymk21zmU5O7mtV0dh/WuaF7FBoiXiN6BOlIVaN+HiuXXZZM/+cUEkFC55pFjoIWQLNlgh22bdzZ5d9y9hlm5FMu8dYo4Biw3nls8voLeBjZbEa8sqfV9GOyVdkzriztsHxkoqoeMKUV8ZEUls4XWCfdJTvF2GU6MYom9UDsJUydmm9G8G1hpM5rf3QPgOz9UiwaOrLhWTWHeBZZBIjN+HTe2RgDrRiYA7oDMwtj9KVJtYD7OATYTwmsX2g/sy07UcJ7PDXZX/Oid0Pi/xoD5ZbV9r46uKZSQ8aXPuVwR6l+UmsEJzYvSYndq/Jid0CyRqJwFGZqCVe7z3Je9vC4HZY2Oirny/8DUv5MNsH19irlsKun86qRJrSw0kPaNlfVM4MlvI51O58sAtmqcxIKjizJNJJZ6YAapb3oS8YeP+KN75vlrFiL5Vl1hcWz7JLx4owRJ5fSq6HlExJJ9ADADV+01neSldwAmKDKpt23Dz110z+Xg1SbNOxhvbwjMUF6IMZljuELQbnhh/i0tsmsiNDUYKICF0iRIa3QmXT21NrVNVix/EOaCtcnGGbjrY4zLjkH6oEFZaODfQvrsvOFo36SRuY9gEiLVpVgvW6GVSy2azaCp1Qu6Ayo6IbMt7hlTjcj9nY4eh4kR1cF8iBL8GrMV7SAhhB69HPeOIiOM5WVvoY5iKkWe2ic/ojWYBZh038fbSILb7xQtjtDunzz4OhzNU3BaIfw4qKwZyQs6gTJVYzfZz+EJVRU8ElfMM4/7u/Y/ojiEPfXjcKd3j6uB32IrfIoUFGIdTrpUYOcFQno/U3No4vsouFwrlHPJI8X2Dz2yFMZcnoSOnRPW4W4sn6oP7629/1LLyq1+gJbd8syiVpYRE6Sp6aZ3VPgDOqP9CeRkNEsHaxcNq3higa1LCDNhH1n+eTbasG9/HO5Th6WE/QzcoytE6j51UHVZOEUopq0InZFC66ZW1AyUAkJIltyiEx1+zyj+zAT11qKOgEDf+5yChocEkmqkLZ8/Cw6BflI8bhGXHI9apJXdKxygkqsShTP5Gs2o6zektZMYzTZWIJgHN7GH13KgfgcYJvEBDO8dIeVkOK6Fa68NMUEs1lRKY9MLI0mJTl+lvokrLYfhx6hbIJFqmY4ZF5zPiwP1lAZy8tZtMeNI2TARVAYEcm7YOZZExW2Vy7JJZs7wAkkpT0iE6waT6YlHZaWUxovT1uSFXtvlGX2Idcbf2T02CghOO1ZzwTDcWSM+x9InrUA8OVrIvdbyRGEDKychgBZNSB0zSMoyt+hOm6hPpxh7TehPrezgahIK+Dcg8+QCw4AZ7+IR9gQXwxuiqlnLCoICRFIrCZB4UD4BT3WULv1qfpJULZz+DzigEas64epvped/QQJRbDipBwEMni6+tdnNk2SUyoHh5Y3dwFBHOifshJE4E4AevRgKWQ0ERkHsF52y09RFOhsjnNy6kWZrUdqsTW/IxubNJ/On9ebB+MwizV18ygsebVDGU492Y3Ro9o32IqhmgH7ZZCZbNmqMD+QbivWnx9mA3PhO4GNQ0EanwmJWx6sj5hSB8PG1tYCPdJGZ+BJFLtPkdrzdAuqbjKBbtDMn19RC/arRFTxD0U3DCFc0lw0wiLUThD0hNMQ9s5nFntX2z2JQiKuWXvuqTiKnR1q6QRlFqCcl4SbdjneX98ySGcIs+DUc6hT8e4qv+6U2wtGZxidai+6ZqubmulY9PXs1SIgV7ia3mNSD+424a4SyPCbGHx7+cd5UdbKh1/fNlGyt5R7WmEX5vyUuEGYxS9mvu86kZpKpF7+InLTogUYWWCGYq2pU7Sn+94vXq5jnQf1Xs/N0UidLFXEhlK3M5fstIHNjtBCKLENNBy3LSTA/hR0ME9TPmZGU+7qgberM/emrEmVGLKDPKYOAwLWlKPsnpO7M0j6636//XZGdZtFIr5rcyhDorf5DdPbHB5Vw+5JG7eiZE1MdWIEPNCMZ9hVWDj3rn4o03hupTm0ZbWOL53Y2AV+fd4VN40uftRx662e3JT+RH5Tzj47GlgZwfC/badgafPDpL/iWVXlt9djhvSfw7c+MZLXJkHjAyHqlsmA2uPXSN/gGvH1gYmt1QPkfmCq+VeNObKjbYK0lfQiN7yVTLPcOhgeUsgsKW88+rt354vuLpT/O7B+TMUDVhRLV/uDSzfcq78YN2qUxe21Xn0hVOr1j0on9uyPNB7uVxdQeY9lh1fd/jIE6YYirURxOvXCxh6mWrokyOH1x3vhmN/Bw8phvgMaOKlAAAAAElFTkSuQmCC`
  constructor(private http: Http,
    private loginService: LoginService,
    private pdfService: PDFService,
    private translate: TranslateService) { }


  getStudentResultDetails(student, juryDescision, returnHTML?: boolean, hasJuryDecided = false): Observable<any> {
    this.hasJuryDecidedFlag = hasJuryDecided;
    return this.http.get(this.academictUrl.generateFinalTranscriptPdf + student._id + '?token=' + this.loginService.getToken())
      .do(
        (res) => {
          const response = res.json();
          if (response.data && response.data.subjects) {
            this.student = student;
            if (response.data.retakeResult) {
              this.juryDescision = this.getResultAfterReTake(response.data.retakeResult);
            } else {
              this.juryDescision = juryDescision;
            }
            this.htmlNTitle = this.formatResultDetailstoHTML(response.data, returnHTML);
          }
        }
      )
      .map(
        res => { return this.htmlNTitle; }
      )
      .catch(this.handleError);
  }

  private generatePdf(html, filename) {
    this.pdfService.getPDF(html, filename, false).subscribe(res => {
      if (res.status === 'OK') {
        const element = document.createElement('a');
        element.href = Print.url + res.filePath;
        element.target = '_blank';
        element.setAttribute('download', res.filename);
        element.click();
      }
    });
  }

  private handleError(error: Response) {
    console.error('Error :', error);
    return Observable.throw(error);
  }

  private formatResultDetailstoHTML(resultDetails, returnHTML?: boolean) {
    let PdfHtml = '';
    let numberOfTest = 0;
    let addMargin = false;

    const checkIfNumber = (total) => {
      if (total < 10) {
        return '&nbsp;&nbsp;' + total;
      }

      return total.toString();
    }
    resultDetails.subjects.forEach(subject => {
      let pageBreak = '';
      if ( addMargin ) {
        addMargin = false;
        pageBreak = 'style="margin-top: 120px;"'
      } else {
        pageBreak = '';
      }

       if (numberOfTest > 12) {
        numberOfTest = 0;
        pageBreak = 'style="page-break-after: always;"'
        addMargin = true;
      }

      const subjectHeader = `
          <div class="subject-container" ${pageBreak}>
          <div class="subject-name-coeff">
            <span class="subject-name"> <p> ${subject.name} </p></span>
            <span class="subject-coeff"><p>${subject.coefficient} </p></span>
          </div>`;

      let subjectTestDetails = '';

      const subjectMarkFooter = `<div class="subject-total-mark">
                              <div class="horizontal-line margin-down-remove"></div>
                                <div class="subject-mark-text">
                                <span class="subject-total-text"><p>
                                ${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.AVERAGE')} ${subject.name}</p></span>
                                <span class="subject-mark-total"><p>${subject.total}/ 20</p></span>
                                <span class="subject-mark-coeff"><p>${subject.credits ? subject.credits : ''}</p></span>
                                </div>
                              <div class="horizontal-line margin-top-remove"></div>
                            </div>
                          </div>`;
      subject.tests.forEach(test => {
        ++numberOfTest;
        const testTemplate = `<div class="test-name-con">
              <span class="text-mark-row">
                <span class="test-name"><p>${test.name}</p>
                </span>
                <div class="test-mark-coeff-total">
                <div class="total-mark">${ test.total === false ? '-' : checkIfNumber(test.total)}
                </div>
                </div>
                <span class="test-mark-coeff"><p>${test.weight}%</p>
                </span>
              </span>
              </div>
              `;
        subjectTestDetails += testTemplate;
      });

      PdfHtml += subjectHeader + subjectTestDetails + subjectMarkFooter;
    });
    const htmlToGenerate = this.styleConditionCompute() + this.computeHeadPartPdf() + PdfHtml + this.computeFooterPartPdf(resultDetails);
    const filename = `${this.student.lastName}-${this.student.firstName}-${this.student.rncpTitle ?
      this.student.rncpTitle.rncpLevel + ' ' + this.student.rncpTitle.longName : ''}-${this.student.school ?
        this.student.school.shortName : ''}`;

    if (!returnHTML) {
      this.generatePdf(htmlToGenerate, filename);
    }
    return {
      html: htmlToGenerate,
      fileName: filename
    };
  }

  private computeHeadPartPdf() {
    let scholarSeason = '2018'; // It is hardcoded at this point of time only. Later we use the scholar season given below
    // scholarSeason = this.student.scholarSeason ? this.student.scholarSeason.scholarseason : '';
    const colorHeader = `
    <div class="retake-stamp">
      <img style="width:70%; height: 70%" src="${this.retakeStamp}">
    </div>
    <div class="main-container">
      <div class="upper-container">
        <div class="con-65">
          <p class="stud-detail-para">${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.STU_LNAME')}: <b>${this.student.lastName} </b></p>
          <p class="stud-detail-para">${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.STU_FNAME')}: <b>${this.student.firstName} </b></p>
          <p class="stud-detail-para">
          ${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.DOB')}: <b>${moment(this.student.dateOfBirth).format('DD-MM-YYYY')}</b></p>
          <p class="stud-detail-para">Section: <b>${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.SECTION')}
          ${this.student.rncpTitle ? this.student.rncpTitle.rncpLevel + ' ' + this.student.rncpTitle.longName : ''}</b></p>
          <p class="stud-detail-para">Session: <b>${scholarSeason}</b></p>
          <p class="stud-detail-para">Centre: <b>${this.student.school ? this.student.school.shortName : ''}</b>
          </p>
        </div>
        <div class="con-35">
          <img style="width:100%; height: 100%" src="${this.c3instiLogo}">
        </div>
      </div>
      <div class="result-container">
        <div style="width:100%;height: 60px;">
          <span class="header-card test-width">
          <p style="padding-top: 8px;">${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.TEST')}</p></span>
          <span class="header-card mark-width">
          <p>${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.FINAL_MARKS')}</p></span>
          <span class="header-card coeff-width">
          <p style="padding-top: 8px;">COEFFICIENT</p></span>
          <span class="header-card credit-width">
          <p>${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.CREDITS')}</p></span>
        </div>
        `;
    return colorHeader;
  }

  private computeFooterPartPdf(resultDetails) {
    const pdffooter = `
        <div class="subject-total-mark" style="margin-left: 5px;">
        <div class="horizontal-line margin-down-remove"></div>
          <div class="subject-mark-text">
          <span class="subject-total-text"><p>
          ${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.FINAL_SCORE')}</p></span>
          <span class="subject-mark-total"><p>${resultDetails.finalScore}</p></span>
          <span class="subject-mark-coeff"><p></p></span>
          </div>
        <div class="horizontal-line margin-top-remove"></div>
      </div>
        </div>
          <div class="result-container">
            <div class="result-text-container">
            <span class="result-test">
            <p style="padding-top: 0;">
            ${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.RESULT')}:
            ${this.translate.instant('FINAL_TRANSCRIPT.CERTIFICATION_STATUS.' + this.juryDescision.toUpperCase())}</p>
            </span>
            <span class="result-mark">
            <p style="padding-top: 0;"> ${resultDetails.totalCredit}</p></span>
            </div>
          </div>
        </div>
        <div class="main-container">
        <span style="padding-left:20%"><img src="${this.stamp}"></span>
        <span style="padding-left:20%"><img src="${this.signature}"></span> </div>
        <div class="main-container" style="text-align: center; margin-left: 12.5%; font-size: 10px;">
            <span><b>${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.FOOTER.PROFESSIONAL_CERTIFICATION')}
            ${this.student.rncpTitle ? this.student.rncpTitle.rncpLevel + ' : ' + this.student.rncpTitle.longName : ''}</b>
            </span><br>
            <span>${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.FOOTER.DESCRIPTION')}</span><br>
            <span>${this.student.rncpTitle && this.student.rncpTitle.certifier ? (this.student.rncpTitle.certifier.shortName + ' - ') : ''}</span>
            <span>${this.translate.instant('FINAL_TRANSCRIPT_RESULT_PDF.FOOTER.ADDRESS')}</span>
        </div>
        `;
    return pdffooter;
  }



  private styleConditionCompute() {
    let headerPx = {
      test: 0,
      mark: 0,
      coeff: 0,
      credit: 0,
      horiLine: 0
    };

    let subjectPx = {
      test: 0,
      markTotal: 0,
      credits: 0,
      creditDisp: 'none',
      subMark: 420,
      subCoef: 130,
      disCoefTotal: 'inline'
    };

    let retakeDisp = 'none';
    if (this.juryDescision === 'pass') {
      headerPx = {
        test: 270,
        mark: 110,
        coeff: 110,
        credit: 70,
        horiLine: 85
      };
      subjectPx = {
        test: 285,
        markTotal: 110,
        credits: 80,
        creditDisp: 'inline',
        subMark: 440,
        subCoef: 110,
        disCoefTotal: 'inline'
      };
    } else {
      headerPx = {
        test: 310,
        mark: 130,
        coeff: 130,
        credit: 0,
        horiLine: 98
      };

      subjectPx = {
        test: 325,
        markTotal: 130,
        credits: 0,
        creditDisp: 'none',
        subMark: 510,
        subCoef: 120,
        disCoefTotal: 'none'
      };

      if ( this.juryDescision === 'retaking' ) {
        retakeDisp = 'inline';
      }

      if ( this.hasJuryDecidedFlag ) {
        retakeDisp = 'none';
      }
    }
    const pdfStyles = `
      <style>

          html, body {
            height: 99%;
          }

        .retake-stamp {
          position: absolute;
          top: 250px;
          left: 310px;
          display: ${retakeDisp};
        }

        .main-container {
          width: 75%;
          margin: 2% auto;
          font-size: 13px;
          font-family: Roboto,sans-serif;
        }

        .con-65 {
          width: 65%;
          float: left;
        }

        .con-35 {
          width: 35%;
          float: left;
        }

        .stud-detail-para {
          margin: 5px 0 5px 30px
        }

        .result-container {
          width: 99%;
          padding: 10px 7px;
          margin: 10px 0 10px 0;
          overflow: auto;
        }

        .result-text-container {
          width: 100%;
          color: white;
          height: 55px;
          font-weight: bold;
          font-size: 15px;
          background-color: #17365d!important;
          -webkit-print-color-adjust: exact;
        }

        .upper-container{
          width: 100%;
          display: block;
          height: 140px;
        }

        .header-card {
          color: white;
          font-weight: bold;
          float: left;
          text-align: center;
          height: 55px;
          background-color: #17365d!important;
          -webkit-print-color-adjust: exact;
        }

        .test-width {
          width: ${headerPx.test}px;
          margin: 0px 0px 0px 5px;
        }
        .mark-width {
          width: ${headerPx.mark}px;
          margin: 0px 0px 0px 5px;
        }
        .coeff-width {
          width: ${headerPx.coeff}px;
          margin: 0px 0px 0px 5px;
        }
        .credit-width {
          width: ${headerPx.credit}px;
          margin: 0px 0px 0px 5px;
        }
        .result-test {
          width: 85%;
          float: left;
          text-align: center;
        }

        .result-mark {
          width: 15%;
          float: left;
          text-align: center;
          display: ${subjectPx.disCoefTotal};
        }

        .subject-container {
          margin-left: 5px;
          width:100%;
        }

        .subject-name-coeff {
          width: 100%;
          font-weight: bold;
          float: left;
          margin-bottom: -10px;
        }
        .test-name-con {
          width: 100%;
          float: left;
          margin: -13px 0px -13px 0px;
          page-break-before: always
        }
        .subject-name {
          width:${subjectPx.subMark}px;
          float: left;
        }
        .subject-coeff {
          width ${subjectPx.subCoef}px;
          float: left;
          text-align: center;
        }

        .subject-mark-total {
          float: left;
          width: ${subjectPx.markTotal}px;
          margin-right: ${subjectPx.markTotal}px;
          text-align: center;
        }

        .subject-mark-coeff {
          float: left;
          width: ${subjectPx.credits}px;
          display: ${subjectPx.creditDisp};
          text-align: center;
        }

        .subject-total-mark {
          width: 100%;
          font-weight: bold;
          float: left;
          font-style: italic;
          font-size: 12px;
          margin-top: 5px;
        }
        .horizontal-line {
          width: ${headerPx.horiLine}%;
          float: left;
          border: 1px solid black;
        }

        .subject-mark-text {
          width: 100%;
          margin-top: -7px;
        }

        .subject-total-text {
          width: ${subjectPx.test}px;
          float: left;
        }

        .text-mark-row {
          float: left;
          width:100%;
        }
        .test-name {
          width: ${headerPx.test}px;
          float: left;
          margin: 0px 0px 0px 5px;
        }

        .test-mark-coeff{
          width: ${headerPx.coeff}px;
          float: left;
          margin: 0px 0px 0px 5px;
          text-align: center;
        }


        .test-mark-coeff-total {
          width: ${headerPx.coeff}px;
          float: left;
          margin: 0px 0px 0px 5px;
          text-align: center;
          display: inline-block;
        }

        .total-mark {
          margin:auto;
          margin-top: 15px;
          width: 30px;
          text-align: left;
        }

        .margin-top-remove {
          margin-top: -10px;
        }

        .margin-down-remove {
          margin-bottom: -20px;
        }
      </style>`;

    return pdfStyles;
  }

  getResultAfterReTake(result: string) {
    if (result === 'PASS1' || result === 'PASS2' || result === 'PASS3') {
      return 'PASS';
    } else if (result === 'FAILED' || result === 'ELIMINATED') {
      return 'FAILED';
    }
  }
}

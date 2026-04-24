import{j as t}from"./maps-CgSYkm8K.js";import{b as B,r as x,L as I}from"./react-oq4iERK0.js";import{k as V,T as G,d as v}from"./index-BAHSAEFe.js";import{a as w}from"./http-42ANG6Sg.js";import{C as U}from"./CheckoutFooter-D8OZ0kE8.js";import{D as W,h as Q,E as Y}from"./jspdf.es.min-Dm1ZQidX.js";import{C as q}from"./circle-check-big-B2LzLpXn.js";import{C as _}from"./clipboard-list-CUMwvZFv.js";import{H as J}from"./house-DrjzvTkq.js";function ie(){var k;const N="medVisionLatestOrderId",C="medVisionCheckoutSummary",g=B(),[s,P]=x.useState([]),[e,z]=x.useState(null),[j,A]=x.useState(!1),M=(()=>{try{return JSON.parse(localStorage.getItem(C)||"null")}catch{return null}})(),h=((k=g.state)==null?void 0:k.checkoutSummary)||M,E=o=>{const a=(o==null?void 0:o.price)??(o==null?void 0:o.totalPrice)??0,r=Number(a);return Number.isFinite(r)?r:0},T=o=>{const a=(o==null?void 0:o.quantity)??1,r=Number(a);return Number.isFinite(r)&&r>0?r:1},b=((e==null?void 0:e.items)||[]).reduce((o,a)=>o+E(a)*T(a),0),L=Number((e==null?void 0:e.totalPrice)||0),D=Number(h==null?void 0:h.discountAmount)||0,F=Math.max(0,b-L),u=Math.max(0,Math.min(b,D>0?D:F)),H=Math.max(0,b-u),$=o=>{const a=String(o||"").trim().toLowerCase();return{upi:"UPI",cod:"Cash on Delivery",card:"Credit/Debit Card",credit:"Credit/Debit Card",debit:"Credit/Debit Card",metamask:"MetaMask Wallet",wallet:"Digital Wallet",netbanking:"Net Banking"}[a]||(o?String(o):"Not specified")},R=new Date(Date.now()+3*24*60*60*1e3).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),X=async()=>{var o,a;try{const r=localStorage.getItem("medVisionToken"),d=((o=g.state)==null?void 0:o.orderId)||localStorage.getItem(N),[i,l]=await Promise.all([w.get(`${v}/fetchdata`,{headers:{Authorization:`Bearer ${r}`}}),d?w.get(`${v}/orders/${d}`,{headers:{Authorization:`Bearer ${r}`}}):w.get(`${v}/orders/me`,{headers:{Authorization:`Bearer ${r}`}})]),c=i.data.userData;P(c);const n=d?l.data.order:(l.data.orders||[]).find(p=>p.status==="Booked")||((a=l.data.orders)==null?void 0:a[0])||null;z(n),n!=null&&n.orderId&&localStorage.setItem(N,n.orderId),localStorage.setItem("userData",JSON.stringify(c))}catch(r){console.error("Error fetching data:",r.message)}},S=async()=>{var a;let o=null;try{if(!(e!=null&&e.orderId)){alert("Order ID not found");return}o=document.createElement("div"),o.style.cssText="position: absolute; left: -9999px; width: 850px; background: white; padding: 40px; font-family: Arial, sans-serif;";const r=`
        <div style="max-width: 850px; margin: 0 auto; background-color: white; padding: 40px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0f766e; padding-bottom: 20px;">
            <h1 style="color: #0f766e; margin: 0; font-size: 28px;">📋 INVOICE</h1>
            <p style="margin: 10px 0; color: #666; font-size: 14px;">Pharmacy MVP - Your Trusted Medicine Store</p>
          </div>

          <!-- Status Badge -->
          <div style="display: inline-block; background-color: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px;">
            ✓ ORDER CONFIRMED
          </div>

          <!-- Order Info Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; padding: 20px; background-color: #f0fdfa; border-radius: 8px;">
            <div>
              <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Invoice Number</p>
              <p style="font-size: 16px; color: #333; font-weight: 500; margin: 0;">#${e.orderId}</p>
            </div>
            <div>
              <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Invoice Date</p>
              <p style="font-size: 16px; color: #333; font-weight: 500; margin: 0;">${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</p>
            </div>
            <div>
              <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Customer Name</p>
              <p style="font-size: 16px; color: #333; font-weight: 500; margin: 0;">${(s==null?void 0:s.name)||(s==null?void 0:s.firstName)||"N/A"}</p>
            </div>
            <div>
              <p style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0;">Payment Method</p>
              <p style="font-size: 16px; color: #333; font-weight: 500; margin: 0;">${$(e.payment)}</p>
            </div>
          </div>

          <!-- Delivery Address -->
          <div style="padding: 20px; background-color: #f0fdfa; border-radius: 8px; margin-bottom: 30px;">
            <p style="font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">Delivery Address</p>
            <p style="font-size: 14px; color: #333; line-height: 1.6; margin: 0;">
              ${(s==null?void 0:s.address)||"Not provided"}<br/>
              ${s!=null&&s.city?s.city+", ":""}${(s==null?void 0:s.state)||""}<br/>
              ${(s==null?void 0:s.pincode)||""}
            </p>
                     <!-- Store Details -->
                     <div style="padding: 20px; background-color: #fff5e6; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
                       <p style="font-size: 14px; color: #d97706; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">🏪 Store Details</p>
                       <p style="font-size: 14px; color: #333; line-height: 1.6; margin: 0;">
                         <strong>${e.storeName||"N/A"}</strong><br/>
                         ${e.storeAddress||"Not provided"}<br/>
                         ${e.storeCity?e.storeCity+", ":""}${e.storeState||""} ${e.storePincode||""}<br/>
                         <strong>Phone:</strong> ${e.storeMobile||"N/A"}<br/>
                         <strong>Email:</strong> ${e.storeEmail||"N/A"}
                       </p>
                     </div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #0f766e; color: white;">
                <th style="padding: 12px; text-align: left; font-weight: bold;">Medicine Name</th>
                <th style="padding: 12px; text-align: left; font-weight: bold;">Quantity</th>
                <th style="padding: 12px; text-align: left; font-weight: bold;">Unit Price</th>
                <th style="padding: 12px; text-align: left; font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(a=e.items)==null?void 0:a.map(m=>`
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 12px;">${m.name||"N/A"}</td>
                  <td style="padding: 12px;">${m.quantity||0}</td>
                  <td style="padding: 12px;">$${Number(m.price).toFixed(2)}</td>
                  <td style="padding: 12px;">$${(Number(m.price)*Number(m.quantity)).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <!-- Summary Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <!-- Order Details -->
            <div style="padding: 20px; background-color: #f0fdfa; border-radius: 8px; border-left: 4px solid #0f766e;">
              <p style="font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">Order Details</p>
              <div style="font-size: 14px; color: #333;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Order Status:</span>
                  <span style="font-weight: bold;">${e.status||"Processing"}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Delivery Type:</span>
                  <span style="font-weight: bold;">${e.deliveryType==="pickup"?"Store Pick-up":"Home Delivery"}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Expected Delivery:</span>
                  <span style="font-weight: bold;">${new Date(Date.now()+3*24*60*60*1e3).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div style="padding: 20px; background-color: #f0fdfa; border-radius: 8px; border-left: 4px solid #0f766e;">
              <p style="font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">Price Summary</p>
              <div style="font-size: 14px; color: #333;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Subtotal:</span>
                  <span style="font-weight: bold;">$${Number(b||0).toFixed(2)}</span>
                </div>
                ${u>0?`
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #0f766e;">Promo Discount:</span>
                  <span style="font-weight: bold; color: #0f766e;">- $${Number(u).toFixed(2)}</span>
                </div>
                `:""}
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666;">Taxes & Fees:</span>
                  <span style="font-weight: bold;">$0.00</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #0f766e; margin-top: 10px; font-size: 16px; font-weight: bold; color: #0f766e;">
                  <span>Total:</span>
                  <span>$${Number(H||0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999;">
            <p style="margin: 10px 0;">Thank you for ordering with Pharmacy MVP. Your health is our priority.</p>
            <p style="margin: 10px 0;">For support, contact us at support@pharmacymvp.com | Phone: +91-XXXX-XXXX</p>
            <p style="margin: 10px 0; color: #ccc;">Generated on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      `;o.innerHTML=r,document.body.appendChild(o);const d=await Q(o,{backgroundColor:"#ffffff",scale:2,logging:!1,useCORS:!0}),i=new Y({orientation:"portrait",unit:"mm",format:"a4"}),l=d.toDataURL("image/png"),c=i.internal.pageSize.getWidth(),n=i.internal.pageSize.getHeight(),p=d.height*c/d.width;let f=p,y=0;for(i.addImage(l,"PNG",0,y,c,p),f-=n;f>0;)y=f-p,i.addPage(),i.addImage(l,"PNG",0,y,c,p),f-=n;i.save(`Invoice_${e.orderId}_${new Date().getTime()}.pdf`)}catch(r){console.error("Error downloading invoice:",r),alert("Failed to download invoice. Please try again.")}finally{o!=null&&o.parentNode&&document.body.removeChild(o)}};return x.useEffect(()=>{X()},[]),x.useEffect(()=>{var o;(o=g.state)!=null&&o.autoDownloadInvoice&&e!=null&&e.orderId&&(j||(A(!0),S()))},[g.state,e,j]),t.jsxs("div",{className:"min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white px-4 sm:px-6 lg:px-8 pb-12",style:{paddingTop:"calc(var(--app-navbar-offset, 88px) + 3rem)"},children:[t.jsxs("div",{className:"max-w-5xl mx-auto",children:[t.jsxs("div",{className:"mb-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl text-white p-6 md:p-8 shadow-xl relative overflow-hidden",children:[t.jsx("div",{className:"absolute -top-16 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"}),t.jsx("div",{className:"absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-cyan-300/10 blur-2xl"}),t.jsxs("div",{className:"relative z-10 flex items-start md:items-center justify-between gap-4 flex-col md:flex-row",children:[t.jsxs("div",{className:"flex items-start gap-4",children:[t.jsx("div",{className:"w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center",children:t.jsx(q,{className:"w-8 h-8 text-white"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-3xl md:text-4xl font-bold",children:"Order Confirmed"}),t.jsx("p",{className:"text-emerald-100 mt-2",children:"Your order has been placed successfully and is now being prepared."})]})]}),t.jsxs("div",{className:"bg-white/15 backdrop-blur rounded-2xl px-4 py-3 border border-white/20 min-w-[220px]",children:[t.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-100",children:"Order ID"}),t.jsxs("p",{className:"text-lg font-semibold",children:["#",(e==null?void 0:e.orderId)||"Pending"]})]})]}),t.jsxs("div",{className:"relative z-10 mt-4 inline-flex items-center gap-2 text-xs bg-white/20 border border-white/20 rounded-full px-3 py-1.5 text-emerald-100",children:[t.jsx(V,{className:"w-3.5 h-3.5"}),"Secure order received and validated"]})]}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6",children:[t.jsxs("div",{className:"bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100",children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-5",children:"Order Summary"}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[t.jsxs("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[t.jsx("p",{className:"text-xs uppercase tracking-wide text-slate-500",children:"Order Number"}),t.jsxs("p",{className:"text-base font-semibold text-slate-900 mt-1",children:["#",(e==null?void 0:e.orderId)||"Pending"]})]}),t.jsxs("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[t.jsx("p",{className:"text-xs uppercase tracking-wide text-slate-500",children:"Payment Method"}),t.jsx("p",{className:"text-base font-semibold text-slate-900 mt-1",children:$(e==null?void 0:e.payment)})]}),t.jsxs("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[t.jsx("p",{className:"text-xs uppercase tracking-wide text-slate-500",children:"Estimated Delivery"}),t.jsx("p",{className:"text-base font-semibold text-slate-900 mt-1",children:R})]}),t.jsxs("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[t.jsx("p",{className:"text-xs uppercase tracking-wide text-slate-500",children:"Confirmation Email"}),t.jsx("p",{className:"text-base font-semibold text-slate-900 mt-1 break-all",children:(s==null?void 0:s.email)||"Not available"}),t.jsxs("div",{className:"rounded-xl border border-amber-200 bg-amber-50 p-4 sm:col-span-2",children:[t.jsx("p",{className:"text-xs uppercase tracking-wide text-amber-700 font-bold",children:"🏪 Store Details"}),t.jsx("p",{className:"text-base font-semibold text-amber-900 mt-2",children:(e==null?void 0:e.storeName)||"N/A"}),t.jsxs("p",{className:"text-sm text-amber-800 mt-1",children:[(e==null?void 0:e.storeAddress)||"Not provided",t.jsx("br",{}),e!=null&&e.storeCity?e.storeCity+", ":"",(e==null?void 0:e.storeState)||""," ",(e==null?void 0:e.storePincode)||""]}),t.jsxs("p",{className:"text-sm text-amber-800 mt-2",children:[t.jsx("strong",{children:"Phone:"})," ",(e==null?void 0:e.storeMobile)||"N/A",t.jsx("br",{}),t.jsx("strong",{children:"Email:"})," ",(e==null?void 0:e.storeEmail)||"N/A"]})]})]})]}),t.jsx("div",{className:"mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200",children:t.jsxs("div",{className:"flex items-start gap-2",children:[t.jsx(G,{className:"w-5 h-5 text-emerald-600 mt-0.5"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-semibold text-emerald-900",children:"Shipping updates will be shared soon"}),t.jsx("p",{className:"text-sm text-emerald-800 mt-1",children:"You will receive status updates as your package moves from processing to doorstep delivery."})]})]})})]}),t.jsxs("div",{className:"bg-white shadow-lg rounded-2xl p-6 border border-gray-100 h-fit",children:[t.jsx("h3",{className:"text-lg font-bold text-gray-900 mb-4",children:"What Next?"}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("button",{onClick:S,className:"w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors font-semibold",children:[t.jsx(W,{className:"w-4 h-4"}),"Download Invoice"]}),t.jsxs(I,{to:"/orders",className:"w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors",children:[t.jsx(_,{className:"w-4 h-4"}),"View My Orders"]}),t.jsxs(I,{to:"/",className:"w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors",children:[t.jsx(J,{className:"w-4 h-4"}),"Continue Shopping"]})]})]})]})]}),t.jsx(U,{})]})}export{ie as OrderConfirmationPage};

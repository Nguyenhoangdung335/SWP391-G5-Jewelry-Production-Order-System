const warrantyCertificateHTML = `
    <div class="certificate">
    <div class="border">
        <h1>WARRANTY CERTIFICATE</h1>
        <h2>Warranty policy</h2>
        <div id="content">
            <p>The product warranty is valid only in the presence of: original purchase document (receipt, invoice), correctly and completely filled out warranty card.</p>
        </div>
        <div class="service-info">
            <p><strong>Service:   </strong><span>Accident insurance</span></p>
            <p>[certificate.uuid]</p>
        </div>
        <div class="signatures">
            <div class="signature">
                <hr/>
                <p>Nguyen Hoang Dung | Insurer</p>
                <p>Phone number:<br>+1 (847) 037 - 3856</p>
            </div>
            <div class="seal">
                <img src="../static/img/warranty_logo.png" alt="Quality Guarantee">
            </div>
            <div class="signature">
                <hr/>
                <p>Jeremiah Elmers | Customer</p>
                <p>Warranty Period:<br>[certificate.expired_on]</p>
            </div>
        </div>
        <div class="company-info">
            <p>Your company name<br>www.yourcompany.com</p>
        </div>
    </div>
</div>
`;

export default warrantyCertificateHTML;
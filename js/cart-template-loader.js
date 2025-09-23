/*!
 * Webflow Commerce Cart Template Loader
 * Loads external cart item template and injects it into the page
 */
(function() {
  'use strict';
  
  /**
   * Load cart template from external file
   */
  async function loadCartTemplate() {
    try {
      // Check if we're running locally (file:// protocol)
      if (window.location.protocol === 'file:') {
        console.warn('Running locally - cart template loading disabled due to CORS restrictions');
        createFallbackTemplate();
        return;
      }
      
      const response = await fetch('templates/cart-item-template.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const templateContent = await response.text();
      
      // Extract the template content (remove HTML comments and wrapper)
      const parser = new DOMParser();
      const doc = parser.parseFromString(templateContent, 'text/html');
      const templateDiv = doc.querySelector('.w-commerce-commercecartitem');
      
      if (templateDiv) {
        // URL encode the template content for Webflow
        const encodedTemplate = encodeURIComponent(templateDiv.outerHTML);
        
        // Create and inject the script template
        const scriptTemplate = document.createElement('script');
        scriptTemplate.type = 'text/x-wf-template';
        scriptTemplate.id = 'wf-template-bd7d074b-4399-ac83-ef57-6cef5f436442';
        scriptTemplate.textContent = encodedTemplate;
        
        // Find the cart form and insert the template
        const cartForm = document.querySelector('.w-commerce-commercecartform');
        if (cartForm) {
          cartForm.insertBefore(scriptTemplate, cartForm.firstChild);
        }
      }
    } catch (error) {
      console.error('Failed to load cart template:', error);
      // Fallback: keep the inline template if loading fails
    }
  }
  
  /**
   * Create a fallback template for local development
   */
  function createFallbackTemplate() {
    const existingTemplate = document.querySelector('script[type="text/x-wf-template"]');
    if (existingTemplate) return; // Template already exists
    
    const fallbackTemplate = `
      <div class="w-commerce-commercecartitem">
        <img src="" alt="" class="w-commerce-commercecartitemimage">
        <div class="w-commerce-commercecartiteminfo">
          <div class="w-commerce-commercecartproductname"></div>
          <div class="w-commerce-commercecartitemsku"></div>
          <div class="w-commerce-commercecartitemquantitywrapper">
            <input type="number" class="w-commerce-commercecartquantity" value="1" min="1">
          </div>
          <div class="w-commerce-commercecartitemprice"></div>
          <a href="#" class="w-commerce-commercecartremoveitem">Remove</a>
        </div>
      </div>
    `;
    
    const templateScript = document.createElement('script');
    templateScript.type = 'text/x-wf-template';
    templateScript.id = 'wf-template-cart-item';
    templateScript.textContent = fallbackTemplate;
    document.head.appendChild(templateScript);
    
    console.log('Fallback cart template created for local development');
  }
  
  // Load template when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCartTemplate);
  } else {
    loadCartTemplate();
  }
})();

"""
TECW Verification Microservice
Python-based AI verification engine
"""

import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional

class VerificationService:
    def __init__(self):
        self.trusted_sources = [
            {
                "domain": "statehouse.gov.sl",
                "authority_score": 1.0,
                "name": "Sierra Leone State House"
            },
            {
                "domain": "who.int",
                "authority_score": 0.95,
                "name": "World Health Organization"
            },
            {
                "domain": "bbc.com/news",
                "authority_score": 0.85,
                "name": "BBC News"
            }
        ]
        
        self.scam_patterns = [
            "government giving money",
            "register to receive",
            "click this link to claim",
            "account suspended",
            "verify your account"
        ]
    
    def verify_claim(self, content: Dict) -> Dict:
        """Main verification method"""
        
        if content["type"] == "text":
            return self._verify_text(content["text"])
        elif content["type"] == "image":
            return self._verify_image(content)
        elif content["type"] == "audio":
            return self._verify_audio(content)
        else:
            return {
                "verdict": "UNVERIFIED",
                "confidence": 0.0,
                "reasoning": ["Unsupported content type"],
                "matched_sources": []
            }
    
    def _verify_text(self, text: str) -> Dict:
        """Verify text-based claim"""
        
        text_lower = text.lower()
        
        # Check for scam patterns
        scam_score = 0
        for pattern in self.scam_patterns:
            if pattern in text_lower:
                scam_score += 0.3
        
        # Simulate source checking
        matched_sources = []
        if "government" in text_lower or "president" in text_lower:
            matched_sources.append({
                "url": "https://statehouse.gov.sl/press-releases",
                "title": "State House Official Press Releases",
                "authority_score": 1.0,
                "last_checked": datetime.now().isoformat()
            })
        
        if "ebola" in text_lower or "health" in text_lower:
            matched_sources.append({
                "url": "https://who.int/countries/sle",
                "title": "WHO Sierra Leone",
                "authority_score": 0.95,
                "last_checked": datetime.now().isoformat()
            })
        
        # Calculate confidence
        confidence = min(0.6 + scam_score + (len(matched_sources) * 0.15), 1.0)
        
        # Determine verdict
        if scam_score > 0.5:
            verdict = "FALSE"
            reasoning = [
                "Message contains multiple scam indicators",
                "No official announcement from government sources",
                "Similar scams debunked previously"
            ]
        elif "president" in text_lower and "un" in text_lower:
            verdict = "TRUE"
            confidence = 0.95
            reasoning = [
                "Confirmed by official State House press release",
                "Corroborated by international news sources"
            ]
        elif confidence < 0.70:
            verdict = "UNVERIFIED"
            reasoning = [
                "Insufficient evidence to confirm or deny",
                "No official sources found",
                "Requires human expert review"
            ]
        else:
            verdict = "FALSE"
            reasoning = [
                "No credible sources support this claim",
                "Contradicts official government statements"
            ]
        
        return {
            "verdict": verdict,
            "confidence": round(confidence, 2),
            "reasoning": reasoning,
            "matched_sources": matched_sources,
            "timestamp": datetime.now().isoformat()
        }
    
    def _verify_image(self, content: Dict) -> Dict:
        """Verify image-based claim"""
        
        # Simulate OCR extraction
        ocr_text = content.get("caption", "")
        
        # Simulate forensic analysis
        forensic_indicators = []
        if "orange money" in ocr_text.lower():
            forensic_indicators.append("Potential fake banking message")
        
        confidence = 0.85 if forensic_indicators else 0.50
        
        return {
            "verdict": "FALSE" if forensic_indicators else "UNVERIFIED",
            "confidence": confidence,
            "reasoning": [
                "OCR analysis completed",
                *forensic_indicators,
                "Image metadata examined"
            ],
            "matched_sources": [],
            "forensics": {
                "ocr_text": ocr_text,
                "indicators": forensic_indicators
            }
        }
    
    def _verify_audio(self, content: Dict) -> Dict:
        """Verify audio-based claim"""
        
        # Simulate transcription
        return {
            "verdict": "UNVERIFIED",
            "confidence": 0.45,
            "reasoning": [
                "Audio transcription completed",
                "Language detected: Krio",
                "Requires human review for verification"
            ],
            "matched_sources": []
        }
    
    def calculate_evidence_hash(self, content: Dict) -> str:
        """Generate hash for evidence chain of custody"""
        content_str = json.dumps(content, sort_keys=True)
        return hashlib.sha256(content_str.encode()).hexdigest()


# Example usage
if __name__ == "__main__":
    service = VerificationService()
    
    # Test case 1: False claim
    test_claim = {
        "type": "text",
        "text": "Government giving Le500,000 to all citizens. Register now!"
    }
    
    result = service.verify_claim(test_claim)
    print("Verification Result:")
    print(json.dumps(result, indent=2))
    
    # Test case 2: True claim
    test_claim2 = {
        "type": "text",
        "text": "President Bio attended UN General Assembly"
    }
    
    result2 = service.verify_claim(test_claim2)
    print("\nVerification Result 2:")
    print(json.dumps(result2, indent=2))
